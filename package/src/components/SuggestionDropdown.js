import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Paper,
  TextField,
  Chip,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ClickAwayListener
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  label: {
    marginTop: 16,
    color: "#C0C0C0",
    marginBottom: 4,
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 13,
  },
  tagsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'end'
  },
  textField: {
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginTop: 4,
  },
  dropdown: {
    borderRadius: 10,
    border: '1px solid',
    borderColor: '#E4E4E4',
    padding: theme.spacing(2),
  },
  dropdownTypo: {
    color: '#c4c4c4',
    fontSize: 14,
  },
  divider: {
    margin: theme.spacing(1.5, 0)
  },
  chip: {
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: theme.spacing(1)
  },
  lisItem: {
    padding: theme.spacing(0)
  },
  list: {
    padding: theme.spacing(0)
  },
  icon: {
    fontSize: 24,
    color: '#E5E5E5',
    cursor: 'pointer',
  },
}));

// const defaultOptions = [{ color: '112, 224, 94', label: 'Hello React' }, { color: '94, 160, 224', label: 'Hello Angular' }]

export const SuggestionDropdown = ({ title, inline = true, defaultOptions = [], selectedOptions = [], onDelete, onCreate, onChange }) => {

  const classes = useStyles();

  const [isOpen, setOpen] = useState(false);

  const [value, setValue] = useState('');

  const [isTagExist, setTagExit] = useState(true);

  const [options, setOptions] = useState([...defaultOptions]);

  const [tags, setTags] = useState([]);

  const [randomColor, setRandomColor] = useState('');

  useEffect(() => setOptions(defaultOptions), [defaultOptions])

  useEffect(() => {
    const selectedTags = [];
    const unSelectedTags = [];
    defaultOptions && defaultOptions.map((defaultOption) => {
      const option = selectedOptions.find((selectedOption) => 
        ((defaultOption.label ?  defaultOption.label : defaultOption) == selectedOption) 
      )
      if(option) selectedTags.push(defaultOption)
      else unSelectedTags.push(defaultOption)
    })
    setTags(selectedTags)
    setOptions(unSelectedTags)
  }, [defaultOptions, selectedOptions])

  const handleMenuToggle = () => {
    setRandomColor(random_rgba());

    setOpen(!isOpen);
  }

  const handleMenuClose = () => setOpen(false);

  const handleValueChange = ({ target: { value } }) => {
    if(value) {
      // const isTagExist = options.find((option) => String(option?.label).toUpperCase() == String(value).toUpperCase()); 
      
      const tags = defaultOptions.filter((option) => String(option?.label).toUpperCase().includes(String(value).toUpperCase()));

      const isTagExist = tags.length > 0
      
      setTagExit(isTagExist);

      setOptions(tags)

    } else {
      setOptions(defaultOptions)
    }
    setValue(value)
  }

  const handleTagAdd = (index) => {
    setTags([ ...tags, options.find((_, indx) => index == indx) ]);

    setOptions(options.filter((_, indx) => index !== indx))

    onChange([ ...tags, options.find((_, indx) => index == indx) ])

    setOpen(false);

    // setOptions(defaultOptions)

    setValue('')
  }

  const handleTagRemove = (index) => {
    setTags(tags.filter((_, indx) => index !== indx))

    const isTagExist = options.filter((_, indx) => index == indx).length > 0;

    // if(!isTagExist)
      setOptions([...options, tags.find((_, indx) => index == indx)])

    onChange(tags.filter((_, indx) => index !== indx))
  }

  const handleOptionCreate = () => {
    const tag = { color: randomColor, label: value };

    setTags([...tags, tag]);

    setValue('')

    onCreate(tag.label, tag.color)

    // onChange([...tags, { ...tag }])

    setOpen(false)

    setOptions(defaultOptions)
  }

  const handleOptionDelete = (index) => {
    setTags(tags.filter((_, indx) => index !== indx))

    setOptions(options.filter((_, indx) => index !== indx))

    onDelete(index)

    setOpen(false)
  }

  return (
    <Fragment>
      <Grid container spacing={4}>
        <Grid item md={5}>
          <Typography className={classes.label} style={{ marginTop: 10 }}>
            {title}
          </Typography>
          <TextField
            fullWidth
            value={value}
            variant="outlined"
            autoComplete={false}
            placeholder="Type something"
            onChange={handleValueChange}
            onClick={handleMenuToggle}
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
          />
          {
            isOpen && (
              <ClickAwayListener onClickAway={handleMenuClose}>
                <Paper className={classes.dropdown}>
                  <Typography className={classes.dropdownTypo}>CREATE NEW</Typography>
                  {Boolean(value) && !isTagExist && <Chip label={value} color='primary' onClick={handleOptionCreate} className={classes.chip} style={{ background: `rgba(${randomColor}, 0.1)`, color: `rgb(${randomColor})` }} />}
                  <Divider className={classes.divider} />
                  <Typography className={classes.dropdownTypo}>EXISTING</Typography>
                  <List dense={true} className={classes.list}>
                    {
                      options.map((option, index) => (
                        <ListItem className={classes.lisItem}>
                          <ListItemText primary={<Chip label={option.label || option} onClick={() => handleTagAdd(index)} className={classes.chip} style={{ background: `rgba(${option.color}, 0.1)`, color: `rgb(${option.color})` }} />} />
                          <DeleteIcon className={classes.icon} onClick={() => handleOptionDelete(index)} />
                        </ListItem>
                      ))
                    }
                  </List>
                </Paper>
              </ClickAwayListener>
            )
          }
        </Grid>
        {!inline && <Grid item md={7} />}
        <Grid item md={7} className={classes.tagsGrid}>
          {
            tags.map((option, index) => (
              <Chip onDelete={() => handleTagRemove(index)} label={option?.label || option} className={classes.chip} style={{ background: `rgba(${option?.color}, 0.1)`, color: `rgb(${option?.color})`, marginRight: 10 }} />
            ))
          }
        </Grid>
      </Grid>
    </Fragment>
  );
};

function random_rgba() {
  let o = Math.round;
  let r = Math.random;
  let s = 255;
  return o(r()*s) + ',' + o(r()*s) + ','  + o(r()*s);
}