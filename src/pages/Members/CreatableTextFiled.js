import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Chip, Divider, IconButton, InputLabel, Select, TextField } from '@material-ui/core'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { Paper } from '@material-ui/core';
const CreatableTextFiled = ({ selectedOptions, onTagsChange, appOptions, setAppOptions, label, updateAppOptionDB }) => {
  const classes = useStyles();
  let arrayHolder = appOptions;
  const [value, setValue] = useState('');
  const [options, setOptions] = useState(appOptions);
  const [selectedTags, setSelectedTags] = useState([]);
  const [show, setShow] = useState(false);
  const [isTagExists, setIsTagExists] = useState(false);

  useEffect(() => {
    if (selectedOptions.length > 0) {
      selectedOptions.map(op => {
        let index = options.findIndex(el => el === op);
        onTagSelect(index, op)
      })
    }
  }, []);
  const handleChange = (e) => {
    setValue(e.target.value)
    const newData = arrayHolder.filter(item => {
      const itemData = `${item.toUpperCase()}`;
      const textData = e.target.value.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setIsTagExists(newData.length < 1);
    setOptions(newData)
  }
  const onTagSelect = (index, item) => {
    let temp = [...options];
    temp.splice(index, 1);
    arrayHolder.splice(index, 1)
    setOptions(temp);
    let tempS = [...selectedTags];
    tempS.push(item)
    setSelectedTags(tempS);
    onTagsChange(tempS);
  }
  const handleCreatTag = (value) => {
    let tempS = [...selectedTags];
    const checkForAlreadyExist = tempS.filter((el) => el.toUpperCase() === value.toUpperCase());
    if (checkForAlreadyExist.length > 0) {
      return
    }
    tempS.push(value)
    setSelectedTags(tempS)
    setValue("");
    setIsTagExists(false);
    setOptions(arrayHolder);
    onTagsChange(tempS);
    let appOptionsTemp = [...appOptions];
    appOptionsTemp.push(value);
    setAppOptions(appOptionsTemp);
    updateAppOptionDB(appOptionsTemp)
  }
  const handleDeleteFromSelectedTags = (index, el) => {
    let tempS = [...selectedTags];
    tempS = tempS.filter(item => item !== el)
    setSelectedTags(tempS)
    onTagsChange(tempS);
    let temp = [...options];
    temp.push(el);
    setOptions(temp);
    arrayHolder.push(el)
  }
  const DeleteFromOptions = (id, item) => {
    let temp = [...options];
    temp = temp.filter(el => el !== item);
    let appOptionsTemp = [...appOptions];
    appOptionsTemp = appOptionsTemp.filter(el => el !== item);
    arrayHolder = appOptionsTemp;
    setOptions(temp);
    setAppOptions(appOptionsTemp);
    updateAppOptionDB(appOptionsTemp);
  }

  return (
    <>
      <Grid item container style={{ padding: 2 }}>
        <Grid item md={3}>
          <InputLabel className={classes.label}>{label}</InputLabel>
          <TextField
            value={value}
            placeholder='Type something'
            variant='outlined'
            onChange={(e) => handleChange(e)}
            onFocus={() => setShow(true)}
            fullWidth
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
          />
          {show &&
            <Paper  >
              <div>
                <div style={{ padding: 8 }}>Create new</div>

                {isTagExists &&
                  <>

                    <Chip onClick={() => handleCreatTag(value)}
                      label={value}
                      style={{ marginLeft: '10px', borderRadius: '10px' }}
                    />
                  </>
                }
                <Divider style={{ margin: 8, }} />
              </div>
              <div style={{ padding: 10 }}>Existing

              </div>

              {options && options.map((el, i) => (
                <span style={{ display: 'flex' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Chip label={el}
                      onClick={() => onTagSelect(i, el)}

                      style={{
                        marginLeft: '10px',
                        fontSize: 16,
                        fontFamily: "Avenir",
                        borderRadius: '10px'

                      }}

                    />
                    <IconButton onClick={() => DeleteFromOptions(i, el)}><DeleteIcon /></IconButton>
                  </div>
                </span>))



              }

            </Paper>}
        </Grid>
        <Grid item md={9} direction='row' style={{ padding: 5, marginTop: 40 }}>
          {selectedTags.length > 0 && selectedTags.map((el, index) =>
            <Chip
              label={el}
              onDelete={() => handleDeleteFromSelectedTags(index, el)}
              style={{ margin: 2 }}

              deleteIcon
            />
          )}
        </Grid>
      </Grid>


    </>
  )
}

export default CreatableTextFiled;
const useStyles = makeStyles((theme) => ({
  label: {
    marginTop: 10,
    color: "#C0C0C0",
    padding: "10px 0 10px 0",
    fontSize: 15,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  textField: {
    // width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
    color: "#000",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#000",
    fontFamily: "Avenir",
  },
}));
