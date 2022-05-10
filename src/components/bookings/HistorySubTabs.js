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
import { useHistory } from "react-router-dom";
import HistoryTable from "./tabs/HistoryTable";
import { getArrayByStatus } from "../../utils/utils";
import { BOOKING_STATUS } from "../../constants";

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
}));

export default function HistorySubTabs({ bookings }) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [value, setValue] = useState(0);

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
            label={`History ${
              getArrayByStatus(
                bookings,
                BOOKING_STATUS.PENDING,
                BOOKING_STATUS.CONFIRMED,
                BOOKING_STATUS.COMPLETED,
                BOOKING_STATUS.NO_SHOW,
                BOOKING_STATUS.CANCELLED
              ).length
            }`}
            classes={{
              root: value === 0 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(0)}
          />
          <Tab
            label={`Pending ${
              getArrayByStatus(bookings, BOOKING_STATUS.PENDING).length
            }`}
            classes={{
              root: value === 1 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(1)}
          />
          <Tab
            label={`Confirmed ${
              getArrayByStatus(bookings, BOOKING_STATUS.CONFIRMED).length
            }`}
            classes={{
              root: value === 2 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(2)}
          />
          <Tab
            label={`Cancellation ${
              getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED).length
            }`}
            classes={{
              root: value === 3 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(3)}
          />
          <Tab
            label={`No-shows ${
              getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length
            }`}
            classes={{
              root: value === 4 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(4)}
          />
          <Tab
            label={`Completed ${
              getArrayByStatus(bookings, BOOKING_STATUS.COMPLETED).length
            }`}
            classes={{
              root: value === 5 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(5)}
          />
          <Tab
            label={`Rejected ${
              getArrayByStatus(bookings, BOOKING_STATUS.REJECT).length
            }`}
            classes={{
              root: value === 6 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(6)}
          />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <HistoryTable
          title={`History`}
          count={
            getArrayByStatus(
              bookings,
              BOOKING_STATUS.PENDING,
              BOOKING_STATUS.CONFIRMED,
              BOOKING_STATUS.COMPLETED,
              BOOKING_STATUS.NO_SHOW,
              BOOKING_STATUS.CANCELLED
            ).length
          }
          bookings={getArrayByStatus(
            bookings,
            BOOKING_STATUS.PENDING,
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.COMPLETED,
            BOOKING_STATUS.NO_SHOW,
            BOOKING_STATUS.CANCELLED
          )}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <HistoryTable
          title={`Pending`}
          count={getArrayByStatus(bookings, BOOKING_STATUS.PENDING).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.PENDING)}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <HistoryTable
          title={`Confirmed`}
          count={getArrayByStatus(bookings, BOOKING_STATUS.CONFIRMED).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.CONFIRMED)}
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <HistoryTable
          title="Cancelled"
          count={getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED)}
        />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <HistoryTable
          title="No-show"
          count={getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW)}
        />
      </TabPanel>
      <TabPanel value={value} index={5} dir={theme.direction}>
        <HistoryTable
          title="Completed"
          count={getArrayByStatus(bookings, BOOKING_STATUS.COMPLETED).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.COMPLETED)}
        />
      </TabPanel>
      <TabPanel value={value} index={6} dir={theme.direction}>
        <HistoryTable
          title="Rejected"
          count={getArrayByStatus(bookings, BOOKING_STATUS.REJECT).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.REJECT)}
        />
      </TabPanel>
    </div>
  );
}
