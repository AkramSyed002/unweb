import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useAppContext } from '../../context/AppContext';
import { Chip, Divider, InputLabel, Select, TextField } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete';
import { CloseIcon } from '@material-ui/icons/Close'
import { Grid } from '@material-ui/core';
import { getTagOptions } from './../../firebase/services';
import DeleteIcon from '@material-ui/icons/Delete';
const CreatebaleTextfiled = () => {
  const { featureOptions, setFeatureOptions, } = useAppContext();
  let arrayHolder = featureOptions;
  const [value, setValue] = useState('');
  const [options, setOptions] = useState(featureOptions);
  const [selectedTags, setSelectedTags] = useState([]);
  const [show, setShow] = useState(false);
  const [isTagExists, setIsTagExists] = useState(false);


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
    setSelectedTags(tempS)

  }
  const handleCreatTag = (value) => {
    let tempS = [...selectedTags];
    const checkForAlreadyExist = tempS.filter((el) => el.toUpperCase() === value.toUpperCase());
    if (checkForAlreadyExist.length > 0) {
      return
    }
    tempS.push(value)
    setSelectedTags(tempS)


  }
  const handleDeleteFromSelectedTags = (index, el) => {
    let temp = [...selectedTags];
    temp = temp.filter(item => item !== el)

    //push those which is'nt match
    setSelectedTags(temp)
    //now push these deleted to array holder to show in getTagOptions
    arrayHolder.push(el)
  }

  const DeleteFromOptions = (id, item) => {
    let temp = [arrayHolder];
    temp = temp[0].filter(el => el !== item);
    arrayHolder.length = 0;
    temp.forEach((el) => arrayHolder.push(el))
    setOptions(arrayHolder);
  }


  return (
    <>
      <Grid item container md={12} style={{ padding: 2 }}>
        <Grid item md={3}>
          <InputLabel style={{ padding: 2 }}>Features</InputLabel>
          <TextField placeholder='Type something' variant='outlined' onChange={(e) => handleChange(e)} onFocus={() => setShow(true)} fullWidth />

          {show &&
            <span style={{ marginLeft: '8px' }} >

              <span style={{ marginLeft: '8px', }}> Create New {value &&
                <Chip onClick={() => handleCreatTag(value)}
                  label={value}
                />
              }
                <Divider style={{ margin: 20 }} />
              </span>
              <span>Existing

              </span>
              {options && options.map((el, i) => (<p style={{ display: 'flex' }}><Chip label={el}
                onClick={() => onTagSelect(i, el)}
                onDelete={() => DeleteFromOptions(i, el)} /></p>))}

            </span>}
        </Grid>
        <Grid item md={9} direction='row' style={{ padding: 5 }}>
          {selectedTags.length > 0 && selectedTags.map((el, index) =>
            <Chip
              label={el}
              onDelete={() => handleDeleteFromSelectedTags(index, el)}
              style={{ margin: 2 }}
              deleteIcon={<DeleteIcon />}
            />
          )}
        </Grid>
      </Grid>


    </>
  )
}

export default CreatebaleTextfiled