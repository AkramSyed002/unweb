import React, { useState, Fragment, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Button,
  Grid,
  Divider,
  Fab,
  TextField,
  MenuItem,
  Select,
  Chip,
} from "@material-ui/core";

import { Scrollbar } from "react-scrollbars-custom";

import CloseIcon from "@material-ui/icons/Close";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { useAppContext } from "../../../context/AppContext";
import { SuggestionDropdown } from "../../SuggestionDropdown";
import {
  addMenuItemToCategory,
  updateMenuItemToCategory,
  getRestaurantTags,
  addRestaurantTag,
} from "../../../firebase/services";
import { MenuItemInitialData } from "../../../constants";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 820,
    backgroundColor: theme.palette.background.paper,
    padding: "0px 40px 18px 40px",
    top: 18,
    left: "27%",
    borderRadius: 16,
  },
  title: {
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 10,
    // marginBottom: 7,
  },
  bookingTitle: {
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
    marginTop: -15,
    fontFamily: "Avenir",
  },
  subTitle: {
    color: "#353535",
    fontSize: 25,
    fontWeight: 700,
    marginTop: 39,
    fontFamily: "Avenir",
  },
  saveButton: {
    fontWeight: 600,
    fontSize: 18,
    background: "#5EA0E0",
    color: "#fff",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    fontFamily: "Avenir",
    "&:hover": {
      color: "#727272",
    },
  },
  cancelButton: {
    fontWeight: 600,
    fontSize: 18,
    color: "#1665D8",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    border: "2px solid #727272",
    marginRight: 32,
    fontFamily: "Avenir",
  },
  textField: {
    width: 300,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
    fontFamily: "Avenir",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#353535",
    fontFamily: "Avenir",
  },
  fabButton: {
    marginTop: -15,
    marginRight: -60,
    background: "#1D244D",
    color: "#fff",
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 16,
    color: "#C0C0C0",
    fontFamily: "Avenir",
  },
  checkboxLabel: {
    fontWeight: 700,
    fontSize: 16,
    color: "#353535",
  },
  deleteSelected: {
    color: "#FF8888",
    fontSize: 16,
    fontWeight: 700,
    marginLeft: "auto",
    cursor: "pointer",
  },
  locationContainer: {
    width: 265,
    height: 150,
    border: "1px solid #C0C0C0",
    borderRadius: 4,
    background: "#fff",
    padding: 16,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
  imageContainer: {
    width: 200,
    height: 200,
    border: "#C0C0C0 dashed 2px",
    borderRadius: 8,
    marginRight: 8,
    marginTop: 20,
  },
}));

const RenderTextFieled = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  indorment,
  disabled,
  onChange,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      id={id}
      disabled={disabled}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
        startAdornment: indorment,
      }}
      onChange={onChange}
    />
  </Grid>
);

export default function ManageItemModal({
  isVisible,
  handleCloseModal,
  record = null,
  selectedMenu = null,
}) {
  const classes = useStyles();
  const { menu, setMenu, menuItems, setMenuItems, selectedRestaurant } =
    useAppContext();

  const [newMenuItem, setNewMenuItem] = useState(MenuItemInitialData);

  const [appOptions, setAppOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  // Selected Menu means its add new menu item so pass down super category and category
  // in selected menu prop to tell which menu category items its going to add against
  // If not selected menu it means is an Edit Menu Item and edit menu item already has super cat and cat ids with it
  useEffect(() => {
    if (selectedMenu) {
      handleInputHandler("super_category_id", selectedMenu.super_category_id);
      handleInputHandler(
        "super_category",
        getMenuTitleByID(selectedMenu.super_category_id)
      );
      handleInputHandler("category", selectedMenu.category_title);
      handleInputHandler("category_id", selectedMenu.category_id);
    }
    if (record) {
      setNewMenuItem(record);
    }
  }, [selectedMenu, record]);

  useEffect(() => {
    async function initAppOptions() {
      const app_options = [];
      const app_options_snapshot = await getRestaurantTags();
      setAppOptions(app_options_snapshot.data()?.values);
    }
    initAppOptions();
  }, []);

  const handleInputHandler = (key, value) => {
    setNewMenuItem((preState) => ({ ...preState, [key]: value }));
  };

  const getMenuTitleByID = (id) => {
    if (!id) return "";
    let index = menu.findIndex((el) => el.id == id);
    return menu[index].title;
  };

  const handleClose = () => {
    setNewMenuItem(MenuItemInitialData);
    handleCloseModal();
  };

  const onAddTag = (tag) => {
    if (tag === "") return;
    if (!newMenuItem.dietary_options.includes(tag)) {
      newMenuItem.dietary_options.push(tag);
      handleInputHandler("dietary_options", newMenuItem.dietary_options);
    }
  };

  const saveMenuItem = async () => {
    newMenuItem.restaurants_offered.push(selectedRestaurant.id);
    try {
      setLoading(true);
      const { menuId, menuPriceId } = await addMenuItemToCategory(newMenuItem);

      let newMenu = Object.assign({}, newMenuItem);
      newMenu.menu_item_Id = menuId;
      newMenu.menu_item_pricing_id = menuPriceId;
      newMenu.restaurant_id = selectedRestaurant.id;
      let temp = [...menu];
      let menuIndex = temp.findIndex(
        (el) => el.id === newMenuItem.super_category_id
      );
      let categoryIndex = temp[menuIndex].menu_categories.findIndex(
        (el) => el.id === newMenuItem.category_id
      );
      temp[menuIndex].menu_categories[categoryIndex].menu_items.push(newMenu);
      setMenu(temp);
      let tempMenuItems = [...menuItems];
      tempMenuItems.push(newMenu);
      setMenuItems(tempMenuItems);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.log("Error adding menu item", error.message);
    }
  };

  const handleTagChange = (tags) => {
    // const newTags = tags.map(({ label }) => label);

    setNewMenuItem((prevState) => ({
      ...prevState,
      tags,
    }));
  };

  const onCreateTag = async (label, color) => {
    if (!label) return;
    const isExist = appOptions.find(
      ({ label: tag }) =>
        String(tag).toLowerCase() == String(label).toLowerCase()
    );
    if (!isExist) await addRestaurantTag([...appOptions, { label, color }]);
  };

  const onDeleteTag = async (index) => {
    const tags = appOptions.filter((_, indx) => index !== indx);
    await addRestaurantTag(tags);
  };

  const updateMenuItem = async () => {
    let temp = [...menu];
    let menuIndex = temp.findIndex(
      (el) => el.id === newMenuItem.super_category_id
    );
    let categoryIndex = temp[menuIndex].menu_categories.findIndex(
      (el) => el.id === newMenuItem.category_id
    );
    let menuItemIndex = temp[menuIndex].menu_categories[
      categoryIndex
    ].menu_items.findIndex(
      (el) => el.menu_item_id === newMenuItem.menu_item_id
    );
    temp[menuIndex].menu_categories[categoryIndex].menu_items[menuItemIndex] =
      newMenuItem;

    let tempMenuItems = [...menuItems];
    let index = tempMenuItems.findIndex(
      (el) => el.menu_item_id === newMenuItem.menu_item_id
    );
    tempMenuItems[index] = newMenuItem;
    try {
      setLoading(true);
      await updateMenuItemToCategory(newMenuItem);
      setMenu(temp);
      setMenuItems(tempMenuItems);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.log("Error updating menu item", error.message);
    }
  };

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Typography className={classes.bookingTitle}>
          {record ? "Edit" : "Add"} Item
        </Typography>
        {/* <Grid
          item
          container
          alignItems="center"
          justify="center"
          className={classes.imageContainer}
        >
          <ControlPointIcon color="primary" />
          <Typography>Add hero photo</Typography>
        </Grid> */}
        <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="ITEM NAME"
            id="itemName"
            placeholder="ITEM NAME"
            value={newMenuItem.item_name}
            onChange={({ target }) =>
              handleInputHandler("item_name", target.value)
            }
          />
        </Grid>
        <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="CURRENCY"
            id="currency"
            placeholder="USD"
            value={newMenuItem.currency}
            onChange={({ target }) =>
              handleInputHandler("currency", target.value)
            }
          />
          <RenderTextFieled
            classes={classes}
            style={{ width: 335, marginLeft: 16 }}
            label="PRICE"
            id="price"
            placeholder="PRICE"
            value={newMenuItem.price}
            onChange={({ target }) => handleInputHandler("price", target.value)}
          />
        </Grid>
        <label className={classes.label}>DESCRIPTION</label>
        <TextField
          variant="outlined"
          rows={3}
          multiline
          style={{ width: 685 }}
          value={newMenuItem.description}
          onChange={({ target }) => {
            handleInputHandler("description", target.value);
          }}
        />

        <Grid item container style={{ marginTop: 10 }}>
          <SuggestionDropdown
            options={
              newMenuItem.dietary_options !== undefined
                ? newMenuItem.dietary_options
                : []
            }
            title="Tags"
            defaultOptions={appOptions}
            onChange={handleTagChange}
            onCreate={onCreateTag}
            onDelete={onDeleteTag}
            selectedItems={newMenuItem.dietary_options}
            onItemChange={onAddTag}
          />
        </Grid>
        <Typography className={classes.subTitle}>
          Category Information
        </Typography>
        <Divider light />
        <Grid item container>
          <Grid item container direction="column" style={{ width: 306 }}>
            <label className={classes.label}>CATEGORY</label>
            <Select
              id="category"
              variant="outlined"
              placeholder="CATEGORY"
              className={classes.textField}
              value={newMenuItem.super_category}
              disabled={true}
              InputProps={{
                className: classes.textFieldText,
              }}
            >
              {menu &&
                menu.map((el) => (
                  <MenuItem key={el.id} value={el.title}>
                    {el.title}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <RenderTextFieled
            classes={classes}
            style={{ width: 310, marginLeft: 16 }}
            label="SECTION"
            id="sectionHeading"
            placeholder="SECTION"
            disabled={true}
            value={newMenuItem.category}
          />
        </Grid>

        {/* <Typography className={classes.subTitle}>Select Location</Typography>
        <Divider light />
        <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="SEARCH LOCATION"
            id="sectionSubHeading"
            placeholder="SEARCH LOCATION"
          />
          <Grid
            item
            container
            alignItems="flex-end"
            style={{ width: "50%", marginLeft: 16, marginBottom: 8 }}
          >
            <Chip label="Boston" onDelete={() => {}} className={classes.chip} />
            <Chip
              label="New York"
              onDelete={() => {}}
              className={classes.chip}
            />
            <Chip label="Miami" onDelete={() => {}} className={classes.chip} />
          </Grid>
        </Grid>

        <Grid className={classes.locationContainer}>
          <Typography
            style={{
              color: "#C0C0C0",
              fontWeight: 500,
              fontSize: 13,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Select
          </Typography>
          <Grid item container direction="column" style={{ width: 120 }}>
            <Chip
              label="Private Dining"
              style={{ marginBottom: 8, borderRadius: 4 }}
            />
            <Chip label="Bar" style={{ marginBottom: 8, borderRadius: 4 }} />
            <Chip
              label="Terrace"
              style={{ marginBottom: 8, borderRadius: 4 }}
            />
          </Grid>
        </Grid> */}

        <Grid item container justify="center" style={{ marginTop: 20 }}>
          <Button
            disabled={loading}
            onClick={handleClose}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !newMenuItem.category}
            onClick={record ? updateMenuItem : saveMenuItem}
            className={classes.saveButton}
          >
            {record ? "Update" : "Save"} Changes
          </Button>
        </Grid>
      </Grid>
    </Scrollbar>
  );

  return (
    <Modal open={isVisible} onClose={handleClose}>
      {body}
    </Modal>
  );
}
