import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import {
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import MenuTabs from "../../components/Menu/MenuTabs";
import { useAppContext } from "../../context/AppContext";
import {
  getMenuByRestaurantId,
  getMenuItemsByRestaurantId,
} from "../../firebase/services";

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
    fontFamily: "Avenir",
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
    fontFamily: "Avenir",
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
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "Avenir",
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
    margin: 5,
  },

  filterMenu: {
    // marginTop: '0em',
    marginLeft: "20%",
    borderRadius: 8,
  },
  filterListItemIcon: {
    minWidth: "35px",
  },
}));

const RenderHeader = ({ classes }) => (
  <Grid item container alignItems="center">
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
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
  handleFilterClose,
  data,
  selectedRestaurant,
  getRestaurantMenu,
  getRestaurantMenuItems,
}) => (
  <Menu
    id="filterMenu"
    anchorEl={isVisible}
    keepMounted
    open={Boolean(isVisible)}
    onClose={handleFilterClose}
    elevation={2}
    className={classes.filterMenu}
  >
    {data &&
      data.map((el, i) => (
        <MenuItem
          selected={el.id == selectedRestaurant?.id}
          onClick={() => {
            getRestaurantMenu(el.id);
            getRestaurantMenuItems(el.id);
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

const ManageMenu = () => {
  const classes = useStyles();
  const {
    restaurants,
    setMenu,
    setMenuItems,
    selectedRestaurant,
    setSelectedRestaurant,
  } = useAppContext();
  const [showRestaurants, setShowRestaurants] = useState(false);

  useEffect(() => {
    if (restaurants.length > 0) {
      getRestaurantMenu(restaurants[0].id);
      getRestaurantMenuItems(restaurants[0].id);
    }
  }, [restaurants]);

  const getRestaurantMenu = async (restaurant_id) => {
    const index = restaurants.findIndex((el) => el.id === restaurant_id);
    setSelectedRestaurant(restaurants[index]);
    const allMenu = await getMenuByRestaurantId(restaurant_id);
    setMenu(allMenu);
  };

  const getRestaurantMenuItems = async (restaurant_id) => {
    const allMenuItems = await getMenuItemsByRestaurantId(restaurant_id);
    setMenuItems(allMenuItems);
  };

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <RenderHeader classes={classes} />
      <Typography className={classes.headerTitle}>
        <span className={classes.grayTitle}>MANAGE MENU</span> <br />
        {selectedRestaurant && selectedRestaurant.name}
      </Typography>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setShowRestaurants(!showRestaurants)}
      >
        <Typography
          color="primary"
          style={{ fontFamily: "Avenir", fontWeight: 700 }}
        >
          Change location
        </Typography>
        <RenderFilter
          classes={classes}
          isVisible={showRestaurants}
          data={restaurants}
          selectedRestaurant={selectedRestaurant}
          handleFilterClose={() => setShowRestaurants(false)}
          getRestaurantMenu={getRestaurantMenu}
          getRestaurantMenuItems={getRestaurantMenuItems}
        />
      </div>

      <MenuTabs />
    </Grid>
  );
};

export default ManageMenu;
