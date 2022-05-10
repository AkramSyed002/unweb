import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { IconButton, InputBase, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import bell from "../../assets/images/bellBlack.png";
import RestaurantsTabs from "../../components/restaurants/RestaurantsTabs";
import { useAppContext } from "../../context/AppContext";
import { getToken } from "../../firebase/services";

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
    <img src={bell} alt="bell" className={classes.bellIcon} />
  </Grid>
);

let adminsArrayHolder = [];
let restaurantsArrayHolder = [];

const Restaurants = () => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");
  const [searchTab, setSearchTab] = useState("Restaurants");
  const { restaurants, admins, setAdmins } = useAppContext();

  const [restaurantsData, setRestaurantsData] = useState(restaurants);
  const [adminsData, setAdminsData] = useState(admins);

  useEffect(() => {
    setRestaurantsData(restaurants);
    setAdminsData(admins);
  }, [restaurants, admins]);

  restaurantsArrayHolder = restaurants;
  adminsArrayHolder = admins;

  const searchFilterFunction = (text) => {
    if (searchTab === "Restaurants") {
      const newData = restaurantsArrayHolder.filter((item) => {
        const itemData = `${item.name.toUpperCase()}
         ${item.contact} 
         ${item.address_line_1.toUpperCase()}
          ${item.address_line_2.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setRestaurantsData(newData);
    } else {
      const newData = adminsArrayHolder.filter((item) => {
        const itemData = `${item.first_name.toUpperCase()}
         ${item.last_name.toUpperCase()} 
         ${item.phone_number} 
        ${item.role.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setAdminsData(newData);
    }
  };

  // Setting Notifications
  useEffect(() => {
    getToken();
  }, []);

  const handleDeleteAdmin = (adminId) => {
    const temp = [...admins];
    let index = temp.findIndex((el) => el.id === adminId);
    temp.splice(index, 1);
    setAdmins(temp);
  };

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <RenderHeader classes={classes} onSearch={searchFilterFunction} />
      <Typography className={classes.title}>Zuma Restaurants</Typography>
      <RestaurantsTabs
        onTabChange={(value) => setSearchTab(value)}
        restaurantsData={restaurantsData}
        adminsData={adminsData}
        handleDeleteAdmin={handleDeleteAdmin}
      />
    </Grid>
  );
};

export default Restaurants;
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 223,
  },
  root: {
    display: "flex",
    alignItems: "center",
    width: 335,
    height: 50,
    marginTop: 20,
    marginLeft: 40,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: "#C0C0C0",
  },
  iconButton: {
    padding: 10,
  },
  bellIcon: {
    width: 24,
    height: 24,
    marginLeft: "auto",
    marginRight: 45,
  },
  title: {
    color: "#353535",
    // color: '#000',
    fontWeight: 700,
    fontSize: 40,
    marginTop: 40,
    marginLeft: 40,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
}));
