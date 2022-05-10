import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, InputBase, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import bell from "../../assets/images/bellBlack.png";
import RestaurantsTabs from "../../components/restaurants/RestaurantsTabs";
import { useAppContext } from "../../context/AppContext";

import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../constants";

const RenderHeader = ({ classes, onSearch }) => (
  <Grid item container alignItems="center">
    <Paper className={classes.root} elevation={0}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={({ target }) => onSearch(target.value)}
      />
      {/* <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon style={{ color: "#5EA0E0" }} />
      </IconButton> */}
    </Paper>
    <img src={bell} alt="bell" className={classes.bellIcon} />
  </Grid>
);

let adminsArrayHolder = [];

const Administrators = () => {
  const classes = useStyles();
  const { admins, setAdmins } = useAppContext();
  const { currentUser } = useAuth();
  const history = useHistory();

  const [adminsData, setAdminsData] = useState(admins);

  useEffect(() => {
    setAdminsData(admins);
  }, [admins]);

  adminsArrayHolder = admins;

  const searchFilterFunction = (text) => {
    const newData = adminsArrayHolder.filter((item) => {
      const itemData = `${item.first_name.toUpperCase()}
         ${item.last_name.toUpperCase()} 
         ${item.phone_number}
         ${item.email.toUpperCase()}   
        ${item.role.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setAdminsData(newData);
  };

  const handleDeleteAdmin = (adminId) => {
    const temp = [...admins];
    let index = temp.findIndex((el) => el.id === adminId);
    temp.splice(index, 1);
    setAdmins(temp);
  };
  if (currentUser === null) return <div />;
  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <RenderHeader classes={classes} onSearch={searchFilterFunction} />

      <Grid item container alignItems="center">
        <Typography className={classes.title}>Administrators</Typography>
        {currentUser.role === USER_ROLES.ADMIN && (
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={() => {
              history.push("/dashboard/add-admin");
            }}
            disableElevation
          >
            Add new
          </Button>
        )}
      </Grid>

      <RestaurantsTabs
        restaurantsData={[]}
        adminsData={adminsData}
        handleDeleteAdmin={handleDeleteAdmin}
        value={1}
      />
    </Grid>
  );
};

export default Administrators;
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
    flex: 1,
    fontFamily: "Avenir",
    border: "1.5px solid #E4E4E4",
    padding: 10,
    borderRadius: "8px",
    fontSize: 16,
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
    fontFamily: "AvenirBold",
    fontStyle: "normal",
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
    marginRight: "2.5%",
  },
}));
