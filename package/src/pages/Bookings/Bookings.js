import React, { useEffect, useState } from "react";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import {
  Checkbox,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Box,
  Button,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import BookingTabs from "../../components/bookings/BookingTabs";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { convertToDateString } from "../../utils/utils";
import { getRestaurantBookingsByID } from "../../firebase/services";
import { USER_ROLES } from "../../constants";
import _, { rest } from "lodash";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  root: {
    display: "flex",
    alignItems: "center",
    width: 335,
    height: 50,
    marginTop: 20,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    // color: '#C0C0C0',
    color: "#000",
  },
  iconButton: {
    padding: 10,
  },
  grayTitle: {
    color: "#C0C0C0",
    fontWeight: 500,
    fontSize: 13,
  },
  title: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 34,
    marginTop: 40,
    marginLeft: 40,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  headerTitle: {
    marginTop: 34,
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  filterTitle: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    border: "none",
  },
  filterLabel: {
    width: "70%",
    fontSize: 16,
    fontWeight: 500,
    color: "#353535",
    cursor: "pointer",
  },
  filterCheckbox: {
    width: "15%",
    marginLeft: "auto",
    marginTop: -10,
  },
  filterMenu: {
    marginTop: "2.5%",
    // marginLeft: '20%',
    // borderRadius: 8,
  },
  filterListItemIcon: {
    minWidth: "35px",
  },
}));

const RenderHeader = ({ classes, onSearch }) => (
  <Grid item container alignItems="center">
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={({ target }) => onSearch(target.value)}
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon style={{ color: "#5EA0E0" }} />
      </IconButton>
    </Paper>
  </Grid>
);

const RenderFilter = ({
  classes,
  isVisible,
  anchorEl,
  handleFilterClose,
  data,
  selectedRestaurant,
  getRestaurantID,
}) => (
  <Menu
    id="filterMenu"
    anchorEl={isVisible}
    keepMounted
    anchorEl={anchorEl}
    open={isVisible}
    onClose={handleFilterClose}
    elevation={2}
    className={classes.filterMenu}
  >
    {data &&
      data.map((el, i) => (
        <MenuItem
          selected={el.id == selectedRestaurant?.id}
          onClick={() => {
            getRestaurantID(el.id);
            handleFilterClose();
          }}
        >
          {el.id == selectedRestaurant?.id ? (
            <ListItemIcon className={classes.filterListItemIcon}>
              <CheckIcon />
            </ListItemIcon>
          ) : (
            <ListItemIcon className={classes.filterListItemIcon}></ListItemIcon>
          )}
          {el.name}
        </MenuItem>
      ))}
  </Menu>
);

let bookingArrayHoler = [];
let historyArrayHolder = [];
const Bookings = () => {
  const classes = useStyles();
  const {
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    bookings,
    setBookings,
  } = useAppContext();

  const { currentUser } = useAuth();

  const [filteredBookings, setFilteredBookings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTab, setSearchTab] = useState("Bookings");
  const [historyData, setHistoryData] = useState(bookings);

  const [currentAdminRestaurants, setCurrentAdminRestaurants] = useState(null);

  useEffect(() => {
    setFilteredBookings(bookings);
    setHistoryData(bookings);
  }, [bookings]);

  bookingArrayHoler = bookings;
  historyArrayHolder = bookings;

  const searchFilterFunction = (text) => {
    if (searchTab === "Bookings") {
      const newData = bookingArrayHoler.filter((item) => {
        const itemData = `${item.user_name}`.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredBookings(newData);
    } else {
      const newData = bookingArrayHoler.filter((item) => {
        const itemData =
          `${item.user_name} ${item.user_phone_number} ${item.booking_timestamp} ${item.guests}`.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setHistoryData(newData);
    }
  };

  useEffect(() => {
    if (currentUser && restaurants) {
      if (currentUser.role === USER_ROLES.GENERAL_MANAGER) {
        setCurrentAdminRestaurants(
          restaurants.filter((el) =>
            currentUser.location_access.includes(el.id)
          )
        );
      } else {
        setCurrentAdminRestaurants(restaurants);
      }
    }
  }, [restaurants, currentUser]);

  useEffect(() => {
    if (currentAdminRestaurants) {
      getRestaurantBookings(currentAdminRestaurants[0].id);
    }
  }, [currentAdminRestaurants]);

  const getRestaurantBookings = async (restaurant_id) => {
    const index = restaurants.findIndex((el) => el.id === restaurant_id);
    setSelectedRestaurant(restaurants[index]);
    const bookingData = await getRestaurantBookingsByID(restaurant_id);
    let tempArray = [...bookings];
    tempArray = bookingData;
    setBookings(tempArray);
  };

  const handleOpenFilter = (event) => setAnchorEl(event?.currentTarget);

  const handleCloseFilter = () => setAnchorEl(null);

  const handleBookingsFilter = async (filterDate) => {
    if (!filterDate) {
      setFilteredBookings(bookings);
      return;
    }
    const filteredBookings = bookings.filter(
      ({ booking_timestamp }) =>
        moment(convertToDateString(booking_timestamp)).format("YYYY-MM-DD") ==
        moment(filterDate).format("YYYY-MM-DD")
    );
    setFilteredBookings(filteredBookings);
  };
  

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <RenderHeader classes={classes} onSearch={searchFilterFunction} />
      <Typography className={classes.headerTitle}>
        {selectedRestaurant && selectedRestaurant.name}
      </Typography>
      <Typography
        color="primary"
        aria-controls="filterMenu"
        aria-haspopup="true"
        onClick={handleOpenFilter}
        style={{ cursor: "pointer" }}
      >
        Filter by location
      </Typography>
      <RenderFilter
        classes={classes}
        anchorEl={anchorEl}
        isVisible={Boolean(anchorEl)}
        data={currentAdminRestaurants}
        selectedRestaurant={selectedRestaurant}
        handleFilterClose={handleCloseFilter}
        getRestaurantID={getRestaurantBookings}
      />
      <BookingTabs
        bookings={filteredBookings}
        onBookingsFilter={handleBookingsFilter}
        onTabChange={(value) => setSearchTab(value)}
        historyData={historyData}
      />
    </Grid>
  );
};

export default Bookings;
