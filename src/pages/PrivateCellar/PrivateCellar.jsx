import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";

import {
  Grid,
  Typography,
  Button,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@material-ui/core";
import { RemoveCircleOutline } from "@material-ui/icons";
import { getPrivateCellar, updatePrivateCellar } from "../../firebase/services";
import {} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 223,
  },
  title: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 34,
    marginTop: 40,
    marginLeft: 40,
    fontFamily: "AvenirBold",
    fontStyle: "normal",
  },
  noBorder: {
    border: "none",
  },
}));

const RenderRow = ({
  title,
  values,
  handleInputChange,
  handleAddInput,
  handleRemove,
  mainIndex,
  handleTitleChange,
  handleRemoveRow,
  isEditMode,
  classes,
}) => {
  const thisStyle = makeStyles(() => ({
    noBorder: {
      border: "none",
    },
  }));
  const classes1 = thisStyle();
  return (
    <div style={{ marginTop: "4%", width: "100%" }}>
      <TextField
        variant="outlined"
        value={title}
        name="title"
        onChange={(e) => {
          handleTitleChange(e, mainIndex);
        }}
        style={{ width: "25%" }}
        disabled={!isEditMode}
        InputProps={{
          classes: { notchedOutline: !isEditMode && classes1.noBorder },
        }}
        inputProps={{ style: { color: "rgb(142, 142, 142)" } }}
      />

      {isEditMode && (
        <Button
          style={{ marginLeft: 20, height: 50 }}
          variant="outlined"
          value="remove"
          color="secondary"
          onClick={() => handleRemoveRow(mainIndex)}
        >
          Remove Category
          {/* <RemoveCircleOutline color="error" /> */}
        </Button>
      )}

      {/* {!isEditMode && ( */}
      <Grid container direction="row">
        <Typography style={{ marginLeft: "27%", color: "rgb(142, 142, 142)" }}>
          Member's Price
        </Typography>
        <Typography style={{ marginLeft: "7%", color: "rgb(142, 142, 142)" }}>
          Retail Price
        </Typography>
      </Grid>
      {/* )} */}

      {values.map((value, subIndex) => (
        <Grid item container style={{ marginTop: 10, paddingRight: 20 }}>
          <TextField
            variant="outlined"
            value={value.name}
            name="name"
            onChange={(e) => handleInputChange("name", e, mainIndex, subIndex)}
            style={{ width: "25.5%" }}
            disabled={!isEditMode}
            InputProps={{
              classes: { notchedOutline: !isEditMode && classes1.noBorder },
            }}
            inputProps={{ style: { color: "rgb(50, 50, 50)" } }}
          />

          <TextField
            style={{ marginLeft: 20 }}
            variant="outlined"
            value={value.memberPrice}
            name="memberPrice"
            onChange={(e) =>
              handleInputChange("memberPrice", e, mainIndex, subIndex)
            }
            disabled={!isEditMode}
            InputProps={{
              classes: { notchedOutline: !isEditMode && classes1.noBorder },
            }}
            inputProps={{ style: { color: "rgb(50, 50, 50)" } }}
          />

          <TextField
            style={{ marginLeft: 20 }}
            variant="outlined"
            value={value.retailPrice}
            name="retailPrice"
            onChange={(e) =>
              handleInputChange("retailPrice", e, mainIndex, subIndex)
            }
            InputProps={{
              classes: { notchedOutline: !isEditMode && classes1.noBorder },
            }}
            inputProps={{ style: { color: "rgb(50, 50, 50)" } }}
          />

          {isEditMode && (
            <Button
              style={{ marginLeft: 20 }}
              variant="outlined"
              value="remove"
              color="secondary"
              onClick={() => handleRemove(mainIndex, subIndex)}
            >
              <RemoveCircleOutline color="error" />
            </Button>
          )}

          {subIndex === values.length - 1 && isEditMode && (
            <Button
              style={{ marginLeft: 20 }}
              value="add"
              variant="outlined"
              onClick={() => handleAddInput(mainIndex, subIndex)}
            >
              Add new row
            </Button>
          )}
        </Grid>
      ))}
      {values.length === 0 && isEditMode && (
        <Grid item container>
          <Button
            style={{ marginTop: 10 }}
            value="add"
            variant="outlined"
            onClick={() => handleAddInput(mainIndex, 0)}
          >
            Add new row
          </Button>
        </Grid>
      )}
    </div>
  );
};

export default function PrivateCellar() {
  const classes = useStyles();
  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState(null);

  const handleInputChange = (key, e, mainIndex, subIndex) => {
    const newItems = [...items];
    newItems[mainIndex].values[subIndex][key] = e.target.value;
    setItems(newItems);
  };

  const handleAddInput = (mainIndex) => {
    setItems((items) => {
      const newItems = [...items];
      newItems[mainIndex].values.push({
        name: "",
        memberPrice: "",
        retailPrice: "",
      });
      return newItems;
    });
  };

  const handleRemove = (mainIndex, subIndex) => {
    setItems((items) => {
      const newItems = [...items];
      newItems[mainIndex].values.splice(subIndex, 1);
      return newItems;
    });
  };

  const handleTitleChange = (e, mainIndex) => {
    setItems((items) => {
      const newItems = [...items];
      newItems[mainIndex].title = e.target.value;
      return newItems;
    });
  };

  const addCategory = async () => {
    setItems((items) => {
      const newItems = [...items];
      newItems.push({
        title: "",
        values: [{ name: "", memberPrice: "", retailPrice: "" }],
      });
      return newItems;
    });
  };

  const removeCategory = (mainIndex) => {
    setItems((items) => {
      const newItems = [...items];
      newItems.splice(mainIndex, 1);
      return newItems;
    });
  };

  const onSave = async () => {
    try {
      console.log(items);
      // await updatePrivateCellar(items);
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = () => setIsEditMode(true);

  useEffect(() => {
    getPrivateCellar(setItems);
  }, []);

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      {/* <RenderHeader classes={classes} /> */}
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ paddingRight: "10%" }}
      >
        <Typography className={classes.title}>Private Cellar</Typography>
        <div>
          <Button
            style={{ color: "white", marginRight: 10 }}
            color="primary"
            variant="contained"
            onClick={isEditMode ? onSave : onEdit}
          >
            {isEditMode ? "Save" : "Edit"}
          </Button>
          {isEditMode && (
            <Button
              style={{ color: "white" }}
              color="secondary"
              variant="contained"
              onClick={() => setIsEditMode(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </Grid>
      <div style={{ width: "100%", marginLeft: "5%" }}>
        {items &&
          items.map((item, index) => (
            <RenderRow
              title={item.title}
              values={item.values}
              handleInputChange={handleInputChange}
              handleAddInput={handleAddInput}
              handleRemove={handleRemove}
              mainIndex={index}
              handleTitleChange={handleTitleChange}
              handleRemoveRow={removeCategory}
              isEditMode={isEditMode}
              classes={classes}
            />
          ))}
        {isEditMode && (
          <Button
            style={{ marginTop: 10, height: 50 }}
            value="add"
            variant="outlined"
            color="primary"
            onClick={addCategory}
          >
            Add New Category
          </Button>
        )}
      </div>
      <RenderFilter />
    </Grid>
  );
}
const RenderFilter = ({
  classes,
  isVisible,
  handleFilterClose,
  data,
  selectedRestaurant,
  getRestaurantMenu,
  getRestaurantMenuItems,
}) => (
  <Menu
    id="filterMenu"
    anchorEl={isVisible}
    keepMounted
    open={Boolean(isVisible)}
    onClose={handleFilterClose}
    elevation={2}
    // className={classes.filterMenu}
  >
    {data &&
      data.map((el, i) => (
        <MenuItem
          selected={el.id == selectedRestaurant?.id}
          onClick={() => {
            getRestaurantMenu(el.id);
            getRestaurantMenuItems(el.id);
            handleFilterClose();
          }}
        >
          {el.id == selectedRestaurant?.id ? (
            <ListItemIcon className={classes.filterListItemIcon}>
              <CheckIcon />
            </ListItemIcon>
          ) : (
            <ListItemIcon className={classes.filterListItemIcon}></ListItemIcon>
          )}
          {el.name}
        </MenuItem>
      ))}
  </Menu>
);
