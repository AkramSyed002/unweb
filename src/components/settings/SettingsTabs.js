import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { PersonalTab } from "./PersonalTab";
import { UsersTab } from "./UsersTab";
//context
import { useAuth } from "../../context/AuthContext";
//constants
import { USER_ROLES } from "../../constants";
import { MemberMarketing } from "./MemberMarketing";

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
    marginTop: 7,
    // paddingLeft: 40,
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
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
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
  updateButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    marginLeft: "auto",
  },
}));

export default function SettingsTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [value, setValue] = useState(0);

  const { currentUser } = useAuth();

  const isSuperAdmin = currentUser?.role == USER_ROLES.ADMIN;

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          <Tab
            label="Personal"
            classes={{
              root: value === 0 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(0)}
          />
          {isSuperAdmin && (
            <Tab
              label="Users"
              classes={{
                root: value === 1 ? classes.selectedTab : classes.tab,
              }}
              {...a11yProps(1)}
            />
          )}
          {isSuperAdmin && (
            <Tab
              label="Member marketing"
              classes={{
                root: value === 2 ? classes.selectedTab : classes.tab,
              }}
              style={{ textTransform: "none" }}
              {...a11yProps(2)}
            />
          )}
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <PersonalTab />
      </TabPanel>
      {isSuperAdmin && (
        <TabPanel value={value} index={1} dir={theme.direction}>
          <UsersTab />
        </TabPanel>
      )}
      {isSuperAdmin && (
        <TabPanel value={value} index={2} dir={theme.direction}>
          <MemberMarketing />
        </TabPanel>
      )}
    </div>
  );
}
