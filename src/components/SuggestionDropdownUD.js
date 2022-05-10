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
  ClickAwayListener,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import { createRandomRGBA } from "../utils/utils";

const useStyles = makeStyles((theme) => ({
  label: {
    marginTop: 16,
    color: "#C0C0C0",
    marginBottom: 4,
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 15,
  },
  tagsGrid: {
    display: "block",
    // flexWrap: "wrap",
    marginTop: "50px",
    // alignItems: "end",
  },
  textField: {
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    marginTop: 4,
  },
  dropdown: {
    borderRadius: 10,
    border: "1px solid",
    borderColor: "#E4E4E4",
    padding: theme.spacing(2),
  },
  dropdownTypo: {
    color: "#c4c4c4",
    fontSize: 14,
  },
  divider: {
    margin: theme.spacing(1.5, 0),
  },
  chip: {
    borderRadius: 8,
    // cursor: "pointer",
    // marginTop: theme.spacing(1),
  },
  lisItem: {
    padding: theme.spacing(0),
  },
  list: {
    padding: theme.spacing(0),
  },
  icon: {
    fontSize: 24,
    color: "#E5E5E5",
    cursor: "pointer",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: '#C0C0C0',
    color: "#000",
    fontFamily: "Avenir",
  },
}));

// const defaultOptions = [{ color: '112, 224, 94', label: 'Hello React' }, { color: '94, 160, 224', label: 'Hello Angular' }]

export const SuggestionDropdownUD = ({
  title,
  inline = true,
  options = [],
  selectedOptions = [],
  onChange,
  disabled,
}) => {
  const classes = useStyles();

  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isTagExist, setTagExit] = useState(true);
  const [tags, setTags] = useState([...selectedOptions]);
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    let temp = [];
    options.forEach((el) => {
      if (!selectedOptions.includes(el)) temp.push(el);
    });
    setDefaultOptions(temp);
  }, []);

  const handleMenuToggle = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = () => setOpen(false);

  const handleValueChange = ({ target: { value } }) => {
    if (value) {
      const tags = options.filter(
        (option) => String(option).toUpperCase() === String(value).toUpperCase()
      );
      const isTagExist = tags.length > 0;
      setTagExit(isTagExist);
    }
    setValue(value);
  };

  const handleTagAdd = (value) => {
    setTags([...tags, value]);
    onChange([...tags, value]);
    setDefaultOptions(defaultOptions.filter((el) => el !== value));
    setOpen(false);
    setValue("");
  };

  const handleTagRemove = (index) => {
    setTags(tags.filter((_, indx) => index !== indx));
    onChange(tags.filter((_, indx) => index !== indx));
    setDefaultOptions([...defaultOptions, tags[index]]);
  };

  const handleOptionCreate = () => {
    setTags([...tags, value]);
    onChange([...tags, value]);
    setValue("");
    setOpen(false);
  };

  return (
    <Fragment>
      <Grid container spacing={4}>
        <Grid item md={5}>
          <Typography className={classes.label} style={{ marginTop: 10 }}>
            {title}
          </Typography>
          <TextField
            disabled={disabled}
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
          {isOpen && !disabled && (
            <ClickAwayListener onClickAway={handleMenuClose}>
              <Paper className={classes.dropdown}>
                <Typography className={classes.dropdownTypo}>
                  Create new
                </Typography>
                {Boolean(value) && !isTagExist && (
                  <Chip
                    label={value}
                    color="primary"
                    onClick={handleOptionCreate}
                    className={classes.chip}
                    style={{ background: `#E0E0E0`}}
                  />
                )}
                <Divider className={classes.divider} />
                <Typography className={classes.dropdownTypo}>
                  Existing
                </Typography>
                <List dense={true} className={classes.list}>
                  {defaultOptions.map((option, index) => (
                    <ListItem className={classes.lisItem}>
                      <ListItemText
                        primary={
                          <Chip
                            label={option}
                            onClick={() => handleTagAdd(option)}
                            className={classes.chip}
                            style={{
                              background: `rgba(${option.color}, 0.1)`,
                              color: `rgb(${option.color})`,
                            }}
                          />
                        }
                      />
                      {/* <DeleteIcon
                        className={classes.icon}
                        onClick={() => handleOptionDelete(index)}
                      /> */}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ClickAwayListener>
          )}
        </Grid>
        {!inline && <Grid item md={7} />}
        <Grid item md={7} className={classes.tagsGrid}>
          {tags.map((option, index) => (
            <Chip
              onDelete={() => handleTagRemove(index)}
              label={option?.label || option}
              className={classes.chip}
              style={{
                background: `rgba(${option?.color}, 0.1)`,
                color: `rgb(${option?.color})`,
                marginRight: 10,
                marginTop: 5,
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Fragment>
  );
};

function random_rgba() {
  let o = Math.round;
  let r = Math.random;
  let s = 255;
  return o(r() * s) + "," + o(r() * s) + "," + o(r() * s);
}
