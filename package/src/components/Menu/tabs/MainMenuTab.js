import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";

import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import NavigateNextOutlinedIcon from "@material-ui/icons/NavigateNextOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";
import MenuIcon from "@material-ui/icons/Menu";

import MenuItemsTable from "./MenuItemsTable";
import ManageMenuModal from "../modals/ManageMenuModal";
import ManageItemModal from "../modals/ManageItemModal";

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
    marginRight: 43,
    cursor: "pointer",
    width: 30,
  },
  editButton: {
    marginLeft: "auto",
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
    >
      <MenuIcon fontSize="large" className={classes.menuIcon} />
      <Typography className={classes.itemTitle}>
        {title} <span className={classes.itemsCount}>{count}</span>
      </Typography>
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
          <MenuItemsTable menuItemsData={menuItems} showEdit={showEdit} />

          {showEdit && (
            <Button
              onClick={openManageItemModal}
              className={classes.addNewButton}
              fullWidth
            >
              Add New +
            </Button>
          )}
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
          <NavigateNextOutlinedIcon
            fontSize="large"
            className={classes.expandIcon}
            onClick={() => setExpandTab(!expandTab)}
          />
        </Fragment>
      )}
    </Grid>
  );
};

const MainMenuTab = ({
  menuCategories,
  expandAll,
  currentMenuTabTitle,
  showEdit,
}) => {
  const classes = useStyles();

  const [editMenuModal, setEditMenuModal] = useState(false);
  const [manageItemModal, setManageItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSupCatAndCat, setSelectedSupCatAndCat] = useState(null);

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
      {menuCategories &&
        menuCategories.map((el, i) => (
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
          />
        ))}

      {showEdit && (
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setEditMenuModal(true);
          }}
          className={classes.addNewSubheading}
          fullWidth
        >
          Add New SubHeading +
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
