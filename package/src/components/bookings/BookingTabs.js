import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Button, Divider } from "@material-ui/core";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import DateRangeIcon from "@material-ui/icons/DateRange";

import BookingSubTabs from "./BookingSubTabs";
import HistorySubTabs from "./HistorySubTabs";

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
  tabLine: {
    borderBottom: "4px solid #E5E5E5",
    borderRadius: 4,
    // paddingTop: -5
  },
  tab: {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
    fontStyle: "normal",
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
    marginBottom: 20,
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

export default function BookingTabs({
  bookings,
  onBookingsFilter,
  historyData,
  onTabChange,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [bookingDate, setBookingDate] = useState(new Date());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateChange = (date) => {
    setBookingDate(date);
    onBookingsFilter(date);
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
            label="Bookings"
            className={classes.tab}
            {...a11yProps(0)}
            onClick={() => onTabChange("Bookings")}
          />
          <Tab
            label="History"
            className={classes.tab}
            {...a11yProps(1)}
            onClick={() => onTabChange("History")}
          />

          <Button
            variant="outlined"
            className={classes.viewButton}
            onClick={() => onBookingsFilter(null)}
          >
            View all
          </Button>
          <Button
            variant="contained"
            className={classes.todayButton}
            onClick={() => onBookingsFilter(new Date())}
          >
            Today
          </Button>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              value={bookingDate}
              // disablePast={true}
              InputAdornmentProps={{ position: "start" }}
              keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
              onChange={handleDateChange}
              style={{ width: 220, marginLeft: 20, marginTop: 0 }}
              margin="dense"
            />
          </MuiPickersUtilsProvider>
        </Tabs>
        <Divider light className={classes.tabBottomLine} />
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <BookingSubTabs bookings={bookings} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <HistorySubTabs bookings={historyData} />
      </TabPanel>
    </div>
  );
}
