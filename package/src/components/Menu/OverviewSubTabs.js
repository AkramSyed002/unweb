import React, { useState } from "react";
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
import { addMenuSuperCategory } from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../constants";
import { isItemInArray } from "../../utils/utils";

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
    width: 83,
    height: 37,
    textTransform: "none",
    borderRadius: 21,
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir ",
  },
  expandAllButton: {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    marginLeft: "auto",
    marginRight: 24,
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
    fontFamily: "Avenir",
    color: "#5EA0E0",
    "&:hover": {
      background: "none",
    },
  },
}));

export default function OverviewSubTabs({ showEdit }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const { menu, setMenu, selectedRestaurant } = useAppContext();
  const { currentUser } = useAuth();

  const [expandAll, setExpandAll] = useState(false);
  const [manageCatModal, setManageCatModal] = useState(false);
  const [superCategoryName, setSuperCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className={classes.root}>
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
                label={`${el.title} ${el.menu_categories.length}`}
                classes={{
                  root: value === index ? classes.selectedTab : classes.tab,
                }}
                {...a11yProps(0)}
              />
            ))}
          {showEdit && (
            <Button
              onClick={() => setManageCatModal(true)}
              variant="contained"
              className={classes.addNewButton}
            >
              New +
            </Button>
          )}
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
        </Tabs>
      </AppBar>

      {menu &&
        menu.map((el, i) => (
          <TabPanel value={value} index={i} dir={theme.direction}>
            <MainMenuTab
              menuCategories={el.menu_categories}
              expandAll={expandAll}
              currentMenuTabTitle={el.title}
              showEdit={showEdit}
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
      />
    </div>
  );
}
