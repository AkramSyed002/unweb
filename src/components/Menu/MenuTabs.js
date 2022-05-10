import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Divider } from "@material-ui/core";
import OverviewSubTabs from "./OverviewSubTabs";
import ItemsTab from "./tabs/ItemsTab";
import { USER_ROLES } from "../../constants";
import { isItemInArray } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import ManageItemModal from "./modals/ManageItemModal";

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
    width: "95%",
    marginTop: 25,
  },
  tab: {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
  },
  todayButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 40,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
  },
  viewButton: {
    marginLeft: "auto",
    color: "#727272",
    width: 90,
    height: 40,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    marginRight: 16,
  },
  tabBottomLine: {
    width: "100%",
    height: 5,
    borderRadius: 8,
    marginTop: -5,
  },
}));

let arrayHolder = [];
export default function MenuTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [value, setValue] = useState(0);
  const { menuItems } = useAppContext();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEdit, setShowEdit] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (currentUser !== null) {
      setShowEdit(
        isItemInArray(
          [USER_ROLES.ADMIN, USER_ROLES.RESERVATIONS_MANAGER],
          currentUser.role
        )
      );
    }
  }, [currentUser]);

  useEffect(() => {
    arrayHolder = menuItems;
  }, [menuItems]);

  if (!showEdit) return <div />;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="#fff" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          TabIndicatorProps={{
            style: {
              height: "5px",
              borderRadius: 4,
            },
          }}
        >
          <Tab label="Overview" className={classes.tab} {...a11yProps(0)} />
          <Tab label="Items" className={classes.tab} {...a11yProps(1)} />
        </Tabs>
        <Divider light className={classes.tabBottomLine} />
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <OverviewSubTabs showEdit={showEdit} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ItemsTab
          showEdit={showEdit}
          menuItems={menuItems}          
          setSelectedRecord={setSelectedRecord}
        />
      </TabPanel>
      {selectedRecord && (
        <ManageItemModal
          isVisible={selectedRecord ? true : false}
          handleCloseModal={() => setSelectedRecord(null)}
          record={selectedRecord}
        />
      )}
    </div>
  );
}
