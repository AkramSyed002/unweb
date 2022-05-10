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
import ActiveBookingsTab from "./tabs/ActiveBookingsTab";
import CancellationTab from "./tabs/CancellationTab";
import BookingModal from "./modals/BookingModal";
import { getArrayByStatus } from "../../utils/utils";
import { BOOKING_STATUS, USER_ROLES } from "../../constants";
import { useAuth } from "../../context/AuthContext";

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
    // background: "linear-gradient(to top right, #70DED6 30%, #3CB1EA)",
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
    fontSize: 20,
    fontWeight: 700,
    color: "#C0C0C0",
    fontFamily: "Avenir",
  },
  addButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 160,
    height: 42,
    textTransform: "none",
    padding: 8,
    borderRadius: 21,
    fontSize: 18,
    fontWeight: 700,
    marginLeft: "auto",
    fontFamily: "Avenir",
  },
}));

export default function BookingSubTabs({ bookings }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const [bookingModal, setBookingModal] = useState(false);
  const [bookingInitialStatus, setBookingInitialStatus] = useState(
    BOOKING_STATUS.PENDING
  );

  const { currentUser } = useAuth();

  const handleBookingModalOpen = (status) => {
    setBookingInitialStatus(status);
    setBookingModal(true);
  };

  const handleBookingModalClose = () => {
    setBookingModal(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="#fff" elevation={0}>
        <div style={{ marginTop: 10 }}></div>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="none"
          textColor="none"
          className={classes.tabLine}
        >
          <Tab
            label={`Active ${
              getArrayByStatus(
                bookings,
                BOOKING_STATUS.PENDING,
                BOOKING_STATUS.CONFIRMED
              ).length
            }`}
            classes={{
              root: value === 0 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(0)}
          />
          <Tab
            label={`Cancellation ${
              getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED).length
            }`}
            classes={{
              root: value === 1 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(1)}
          />
          <Tab
            label={`No-Shows ${
              getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length
            }`}
            classes={{
              root: value === 2 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(2)}
          />
          {currentUser.role !== USER_ROLES.GENERAL_MANAGER && (
            <Button
              variant="contained"
              className={classes.addButton}
              onClick={() => handleBookingModalOpen(BOOKING_STATUS.PENDING)}
            >
              New Booking +
            </Button>
          )}
        </Tabs>
      </AppBar>
      <div style={{ marginTop: 20 }}></div>
      <TabPanel
        value={value}
        index={0}
        dir={theme.direction}
        style={{ marginTop: 20 }}
      >
        <ActiveBookingsTab
          bookings={getArrayByStatus(
            bookings,
            BOOKING_STATUS.PENDING,
            BOOKING_STATUS.CONFIRMED
          )}
          handleBookingModalOpen={handleBookingModalOpen}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <CancellationTab
          title="Cancellations"
          count={getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED).length}
          allBookings={getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED)}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <CancellationTab
          title="No-Show"
          count={getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length}
          allBookings={getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW)}
        />
      </TabPanel>
      <BookingModal
        bookingModal={bookingModal}
        handleBookingModalClose={handleBookingModalClose}
        title="Create new booking"
        bookingStatus={bookingInitialStatus}
      />
    </div>
  );
}
