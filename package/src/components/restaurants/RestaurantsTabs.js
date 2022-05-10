import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Button,
  Divider,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";
import RestaurantsTable from "./Tabs/RestaurantsTable";
import AdminsTable from "./Tabs/AdminsTable";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

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
    paddingLeft: 40,
  },
  tabLine: {
    borderBottom: "4px solid #E5E5E5",
    borderRadius: 4,
  },
  tab: {
    textTransform: "none",
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Avenir",
    fontStyle: "normal",
    color: "#C0C0C0",
  },
  addButton: {
    marginLeft: "auto",
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Avenir",
  },
  tabBottomLine: {
    width: "100%",
    height: 5,
    borderRadius: 8,
    marginTop: -5,
  },
}));

export default function RestaurantsTabs({
  onTabChange,
  restaurantsData,
  adminsData,
  handleDeleteAdmin,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAdd = () => {
    if (value === 0) {
      history.push(ROUTES.DASHBOARD_ADD_REST);
    } else if (value === 1) {
      history.push("/dashboard/add-admin");
    }
  };

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
          <Tab
            label="Restaurants"
            className={classes.tab}
            {...a11yProps(0)}
            onClick={() => onTabChange("Restaurants")}
          />
          <Tab
            label="Administrators"
            className={classes.tab}
            {...a11yProps(1)}
            onClick={() => onTabChange("Administrators")}
          />
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={handleAdd}
          >
            Add new
          </Button>
        </Tabs>
        <Divider light className={classes.tabBottomLine} />
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <RestaurantsTable restaurants={restaurantsData} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <AdminsTable
          admins={adminsData}
          handleDeleteAdmin={handleDeleteAdmin}
        />
      </TabPanel>
    </div>
  );
}
