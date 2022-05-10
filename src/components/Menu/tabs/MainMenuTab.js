import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";

import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import NavigateNextOutlinedIcon from "@material-ui/icons/NavigateNextOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";
import MenuIcon from "@material-ui/icons/Menu";

import MenuItemsTable from "./MenuItemsTable";
import ManageMenuModal from "../modals/ManageMenuModal";
import ManageItemModal from "../modals/ManageItemModal";
import PageLoader from "../../PageLoader";
import LoadingModal from "../../members/modals/LoadingModal";

const useStyles = makeStyles((theme) => ({
  menuItemsContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    marginBottom: 32,
    marginTop: 16,
    padding: "24px 16px",
  },
  itemTitle: {
    fontSize: 25,
    fontWeight: 700,
    color: "#353535",
    fontFamily: "Avenir",
    // paddingLeft: 40,
  },
  itemsCount: {
    color: "#C0C0C0",
    marginLeft: 22,
  },
  expandIcon: {
    cursor: "pointer",
    width: 30,
  },
  editButton: {
    color: "#727272",
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
    "&:hover": {
      background: "none",
    },
  },
  menuIcon: {
    marginRight: 18,
    color: "#727272",
  },
  notiTitle: {
    color: "#353535",
    fontSize: 15,
  },
  notificationData: {
    background: "#fff",
    margin: 14,
    borderRadius: 8,
    height: 75,
    padding: 16,
  },
  addNewButton: {
    border: "2px dashed #C0C0C0",
    height: 50,
    fontSize: 16,
    fontWeight: 700,
    color: "#727272",
    textTransform: "none",
  },
  addNewSubheading: {
    border: "2px dashed #C0C0C0",
    height: 86,
    fontSize: 16,
    fontWeight: 700,
    color: "#727272",
    textTransform: "none",
    marginBottom: 40,
    borderRadius: 16,
  },
}));

const RenderMenuItemsContainer = ({
  classes,
  title,
  count,
  handleEditMenuModalOpen,
  menuItems,
  expandAll,
  openManageItemModal,
  showEdit,
  deleteSubMenu,
}) => {
  const [expandTab, setExpandTab] = useState(expandAll);

  useEffect(() => {
    setExpandTab(expandAll);
  }, [expandAll]);

  return (
    <Grid
      item
      container
      alignItems="center"
      className={classes.menuItemsContainer}
      // direction="row"
      justifyContent="space-between"
    >
      <Grid
        item
        container
        alignContent="center"
        direction="row"
        style={{ width: "50%" }}
      >
        <MenuIcon fontSize="large" className={classes.menuIcon} />
        <Typography className={classes.itemTitle}>
          {title} <span className={classes.itemsCount}>{count}</span>
        </Typography>
      </Grid>
      <Grid
        item
        container
        alignContent="center"
        alignItems="flex-end"
        justifyContent="flex-end"
        style={{ width: "50%" }}
      >
        {expandTab ? (
          <Fragment>
            <Button
              variant="text"
              className={classes.editButton}
              onClick={handleEditMenuModalOpen}
              disabled={!showEdit}
            >
              {showEdit && "Edit"}
            </Button>
            <ExpandMoreOutlinedIcon
              fontSize="large"
              className={classes.expandIcon}
              onClick={() => setExpandTab(!expandTab)}
            />
            {/* here was menu items table */}
          </Fragment>
        ) : (
          <Fragment>
            <Button
              variant="text"
              onClick={handleEditMenuModalOpen}
              className={classes.editButton}
              disabled={!showEdit}
            >
              {showEdit && "Edit"}
            </Button>
            <Button
              variant="text"
              onClick={deleteSubMenu}
              className={classes.editButton}
              disabled={!showEdit}
            >
              {showEdit && "Delete"}
            </Button>
            <NavigateNextOutlinedIcon
              fontSize="large"
              className={classes.expandIcon}
              onClick={() => setExpandTab(!expandTab)}
            />
          </Fragment>
        )}
      </Grid>
      {expandTab && (
        <Grid item container>
          <MenuItemsTable menuItemsData={menuItems} showEdit={showEdit} />
          {showEdit && (
            <Button
              onClick={openManageItemModal}
              className={classes.addNewButton}
              fullWidth
            >
              Add new +
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

const MainMenuTab = ({
  menuCategories,
  expandAll,
  currentMenuTabTitle,
  showEdit,
  handleDeleteSubCategory,
  superMenuIndex,
}) => {
  const classes = useStyles();

  const [editMenuModal, setEditMenuModal] = useState(false);
  const [manageItemModal, setManageItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSupCatAndCat, setSelectedSupCatAndCat] = useState(null);

  const [currentMenuCat, setCurrentMenuCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const asyncFunction = () => {
    return new Promise((resolve) => {
      setTimeout(function () {
        setCurrentMenuCat(menuCategories);
        resolve();
      }, 2000);
    });
    // 2 seconds timeout
  };

  const getList = async () => {
    setLoading(true);
    await asyncFunction();
    setLoading(false);
  };

  useEffect(() => {
    getList();
  }, [menuCategories]);

  const handleEditMenuModalOpen = (index) => {
    setSelectedCategory(menuCategories[index]);
    setEditMenuModal(true);
  };

  const handleEditMenuModalClose = () => {
    setSelectedCategory(null);
    setEditMenuModal(false);
  };

  const handleManageItemModalOpen = (item) => {
    setSelectedSupCatAndCat({
      super_category_id: item.super_category_id,
      category_id: item.id,
      category_title: item.title,
    });
    setManageItemModal(true);
  };

  const handleManageItemModalClose = () => {
    setSelectedSupCatAndCat(null);
    setManageItemModal(false);
  };

  return (
    <Grid container direction="column">
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {currentMenuCat &&
        currentMenuCat.map((el, i) => (
          <RenderMenuItemsContainer
            key={el.id}
            classes={classes}
            title={el.title}
            menuItems={el.menu_items}
            count={el.menu_items.length}
            handleEditMenuModalOpen={() => handleEditMenuModalOpen(i)}
            expandAll={expandAll}
            openManageItemModal={() => handleManageItemModalOpen(el)}
            showEdit={showEdit}
            deleteSubMenu={() => handleDeleteSubCategory(superMenuIndex, i)} // super menu index needed so we know which Main Menu it is under
          />
        ))}

      {showEdit && !loading && (
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setEditMenuModal(true);
          }}
          className={classes.addNewSubheading}
          fullWidth
        >
          Add new subheading +
        </Button>
      )}

      <ManageMenuModal
        selectedMenu={selectedCategory}
        editMenuModal={editMenuModal}
        handleCloseModal={handleEditMenuModalClose}
        currentMenuTabTitle={currentMenuTabTitle}
      />
      <ManageItemModal
        isVisible={manageItemModal}
        handleCloseModal={handleManageItemModalClose}
        selectedMenu={selectedSupCatAndCat}
      />
    </Grid>
  );
};

export default MainMenuTab;
