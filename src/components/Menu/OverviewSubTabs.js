import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";
import MainMenuTab from "./tabs/MainMenuTab";
import { useAppContext } from "../../context/AppContext";
import ManageSuperCatModal from "./modals/ManageSuperCatModal";
import {
  addMenuSuperCategory,
  deleteMenuSuperCategory,
  deleteSubCategoryFromMenu,
  updateMenuSuperCategory,
} from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../constants";
import { isItemInArray } from "../../utils/utils";
import AlertModal from "../members/modals/AlertModal";
import LoadingModal from "../members/modals/LoadingModal";
import { useEffect } from "react";
import { getServerTime } from "../../firebase/firebase";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 25,
  },
  tabLine: {
    borderRadius: 4,
  },
  selectedTab: {
    color: "#353535",
    background: "#E5E5E5",
    borderRadius: 21,
    minWidth: "auto",
    width: "auto",
    minHeight: 37,
    height: 37,
    marginRight: 18,
    textTransform: "capitalize",
    fontSize: 16,
    fontWeight: 700,
  },
  tab: {
    minWidth: "auto",
    width: "auto",
    minHeight: 37,
    height: 37,
    borderRadius: 21,
    marginRight: 18,
    margin: 0,
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: 700,
    color: "#C0C0C0",
    fontFamily: "Avenir",
  },
  addNewButton: {
    color: "#727272",
    background: "#E5E5E5",
    width: 100,
    height: 37,
    textTransform: "none",
    borderRadius: 21,
    fontSize: 18,
    fontWeight: 700,
    // marginLeft: 50, //
    fontFamily: "Avenir ",
  },
  editButton: {
    color: "#727272",
    background: "#E5E5E5",
    width: 100,
    height: 37,
    textTransform: "none",
    borderRadius: 21,
    fontSize: 18,
    fontWeight: 700,
    marginLeft: 40,
    fontFamily: "Avenir ",
  },
  expandAllButton: {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    marginLeft: 15,
    marginRight: 24,
    marginBottom: 25, //
    fontFamily: "Avenir",
    color: "#5EA0E0",
    "&:hover": {
      background: "none",
    },
  },
  collapseAllButton: {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 25, //
    fontFamily: "Avenir",
    color: "#5EA0E0",
    "&:hover": {
      background: "none",
    },
  },
}));

export default function OverviewSubTabs({
  showEdit,
  menu,
  setMenu,
  selectedRestaurant,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const [expandAll, setExpandAll] = useState(false);
  const [manageCatModal, setManageCatModal] = useState(false);
  const [updateCatModal, setUpdateCatModal] = useState(false);
  const [superCategoryName, setSuperCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteSubCatDetails, setDeleteSubCatDetails] = useState(null);

  const [selectedMenuName, setSelectedMenuName] = useState("");

  useEffect(() => {
    setSelectedMenuName(menu[0]?.title);
  }, []);

  const handleChange = (event, newValue) => {
    setSuperCategoryName("");
    setValue(newValue);
  };

  const addSuperCategory = async () => {
    const isCategoryExist = menu.find(
      (menu) =>
        String(menu.title).toLowerCase() ===
        String(superCategoryName).toLowerCase()
    );

    if (isCategoryExist) {
      setError("Category name already exist");
      return;
    }

    setError("");

    try {
      setLoading(true);
      const { id } = await addMenuSuperCategory({
        title: superCategoryName,
        createdAt: getServerTime(),
        restaurant_id: selectedRestaurant.id,
      });
      let temp = [...menu];
      temp.push({
        title: superCategoryName,
        restaurant_id: selectedRestaurant.id,
        id: id,
        menu_categories: [],
      });
      setMenu(temp);
      setSuperCategoryName("");
      setManageCatModal(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error adding super category", error.message);
    }
  };

  const updateSuperCategory = async () => {
    const isCategoryExist = menu.find(
      (menu) =>
        String(menu.title).toLowerCase() ===
        String(superCategoryName).toLowerCase()
    );

    if (isCategoryExist) {
      setError("Category name already exist");
      return;
    }
    setError("");
    try {
      setLoading(true);
      let temp = [...menu];
      let index = temp.findIndex((el) => el.title === selectedMenuName);
      temp[index].title = superCategoryName;

      console.log(superCategoryName);
      await updateMenuSuperCategory(temp[index].id, {
        title: superCategoryName,
      });
      setMenu(temp);
      setSelectedMenuName(superCategoryName);
      setSuperCategoryName("");
      setUpdateCatModal(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error adding super category", error.message);
    }
  };

  const deleteSuperCategory = async () => {
    let temp = [...menu];
    let index = temp.findIndex((el) => el.title === selectedMenuName);

    if (
      temp[index].menu_categories !== undefined &&
      temp[index].menu_categories.length > 0
    )
      return alert(
        "Please remove all sub categories before deleting this menu"
      );

    setLoading(true);
    try {
      await deleteMenuSuperCategory(temp[index].id);
      temp.splice(index, 1);
      setMenu(temp);
      setUpdateCatModal(false);
      setLoading(false);
    } catch (error) {
      console.log("Error dele super menu", error);
      setLoading(false);
    }
  };

  const deleteSubCategory = async () => {
    const { superCategoryIndex, categoryIndex } = deleteSubCatDetails;
    let temp = [...menu];
    console.log(temp[superCategoryIndex]);
    let { menu_items, id } =
      temp[superCategoryIndex].menu_categories[categoryIndex];
    if (menu_items.length > 0)
      return alert(
        "Please remove all menu items before deleting this category"
      );
    setLoading(true);
    temp[superCategoryIndex].menu_categories.splice(categoryIndex, 1);
    try {
      await deleteSubCategoryFromMenu(temp[superCategoryIndex].id, id);
      setMenu(temp);
      setDeleteSubCatDetails(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setDeleteSubCatDetails(null);
      console.log("Error delete sub cate", error);
    }
  };

  return (
    <div className={classes.root}>
      {loading && <LoadingModal modalVisible={true} />}
      <Grid item container justifyContent="flex-end">
        <Button
          variant="text"
          color="primary"
          className={classes.expandAllButton}
          onClick={() => setExpandAll(true)}
        >
          Expand All
        </Button>
        <Button
          variant="text"
          color="primary"
          className={classes.collapseAllButton}
          onClick={() => setExpandAll(false)}
        >
          Collapse All
        </Button>
      </Grid>
      <Grid item container direction="row" justifyContent="space-between">
        <Grid item container alignItems="center" style={{ width: "79%" }}>
          {/* Appbar */}
          <AppBar position="static" color="#fff" elevation={0}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="none"
              textColor="none"
              className={classes.tabLine}
            >
              {menu &&
                menu.map((el, index) => (
                  <Tab
                    key={el.id}
                    label={`${
                      el.title.length > 10
                        ? el.title.substring(0, 20) + "..."
                        : el.title
                    }  
        ${el.menu_categories.length}`}
                    onClick={() => setSelectedMenuName(el.title)}
                    classes={{
                      root: value === index ? classes.selectedTab : classes.tab,
                    }}
                    {...a11yProps(0)}
                  />
                ))}
            </Tabs>
          </AppBar>
        </Grid>
        {/* buttons */}
        <Grid item container justifyContent="center" style={{ width: "20%" }}>
          {showEdit && (
            <Button
              onClick={() => setManageCatModal(true)}
              variant="contained"
              className={classes.addNewButton}
              disableElevation
            >
              New +
            </Button>
          )}
          {showEdit && (
            <Button
              disableElevation
              onClick={() => {
                setSuperCategoryName(selectedMenuName);
                setUpdateCatModal(true);
              }}
              variant="contained"
              className={classes.editButton}
            >
              Edit
            </Button>
          )}
        </Grid>
      </Grid>

      {menu &&
        menu.map((el, i) => (
          <TabPanel value={value} index={i} dir={theme.direction}>
            <MainMenuTab
              menuCategories={el.menu_categories}
              expandAll={expandAll}
              currentMenuTabTitle={el.title}
              showEdit={showEdit}
              handleDeleteSubCategory={(superCategoryIndex, categoryIndex) =>
                setDeleteSubCatDetails({ superCategoryIndex, categoryIndex })
              }
              superMenuIndex={i}
            />
          </TabPanel>
        ))}

      <ManageSuperCatModal
        menuModal={manageCatModal}
        handleClose={() => setManageCatModal(false)}
        onChange={({ target }) => setSuperCategoryName(target.value)}
        categoryName={superCategoryName}
        onAddCategory={addSuperCategory}
        error={error}
        loading={loading}
        isUpdate={false}
      />
      <ManageSuperCatModal
        menuModal={updateCatModal}
        handleClose={() => setUpdateCatModal(false)}
        onChange={({ target }) => setSuperCategoryName(target.value)}
        categoryName={superCategoryName}
        onAddCategory={updateSuperCategory}
        error={error}
        loading={loading}
        isUpdate={true}
        handleDelete={deleteSuperCategory}
      />
      <AlertModal
        modalVisible={deleteSubCatDetails === null ? false : true}
        description={"Are you sure you want to delete this menu category?"}
        handleClose={() => setDeleteSubCatDetails(null)}
        onConfirmClick={deleteSubCategory}
      />
    </div>
  );
}
