import React, { useState, useEffect } from "react";
import clsx from "clsx";
import firebase from "firebase";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { ListItemText, MenuItem, Toolbar } from "@material-ui/core";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/images/logo.png";
import location from "../../assets/images/Location.png";
import staff from "../../assets/images/Staff.png";
import date from "../../assets/images/Date.png";
import menu from "../../assets/images/Menu.png";
import bell from "../../assets/images/bell.png";
import barChat from "../../assets/images/bar-chart.png";
import { ROUTES } from "../../constants/routes";
import settings from "../../assets/images/settings.png";
import logout from "../../assets/images/logout.png";
import { removeFCMToken } from "../../firebase/firebase";

const drawerWidth = 223;

const SideDrawer = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { logoutUser } = useAuth();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const drawerItems = [
    {
      icon: location,
      title: "Restaurants",
      link: ROUTES.DASHBOARD_MANAGE_REST,
      activeIndex: 0,
      onClick: () => {
        history.push(ROUTES.DASHBOARD_MANAGE_REST);
        setSelectedItemIndex(0);
      },
    },
    {
      icon: staff,
      title: "Administrators",
      link: ROUTES.ADMIN_VIEW_ALL,
      activeIndex: 1,
      onClick: () => {
        history.push(ROUTES.ADMIN_VIEW_ALL);
        setSelectedItemIndex(1);
      },
    },
    {
      icon: staff,
      title: "Members",
      link: "/dashboard/manage-members",
      activeIndex: 2,
      onClick: () => {
        history.push("/dashboard/manage-members");
        setSelectedItemIndex(2);
      },
    },
    {
      icon: date,
      title: "Bookings",
      link: "/dashboard/manage-bookings",
      activeIndex: 3,
      onClick: () => {
        history.push("/dashboard/manage-bookings");
        setSelectedItemIndex(3);
      },
    },
    {
      icon: menu,
      title: "Menu",
      link: "/dashboard/manage-menu",
      activeIndex: 4,
      onClick: () => {
        history.push("/dashboard/manage-menu");
        setSelectedItemIndex(4);
      },
    },
    {
      icon: bell,
      title: "Notifications",
      link: "/dashboard/manage-notifications",
      activeIndex: 5,
      onClick: () => {
        history.push("/dashboard/manage-notifications");
        setSelectedItemIndex(5);
      },
    },
    {
      icon: barChat,
      title: "Analytics",
      link: "/dashboard/manage-analytics",
      activeIndex: 6,
      onClick: () => {
        history.push("/dashboard/manage-analytics");
        setSelectedItemIndex(6);
      },
    },
    {
      icon: settings,
      title: "Settings",
      link: "/dashboard/manage-settings",
      activeIndex: 7,
      onClick: () => {
        history.push("/dashboard/manage-settings");
        setSelectedItemIndex(7);
      },
    },
    {
      icon: menu,
      title: "Private Cellar",
      link: "/dashboard/private-cellar",
      activeIndex: 9,
      onClick: () => {
        history.push("/dashboard/private-cellar");
        setSelectedItemIndex(9);
      },
    },
    {
      icon: logout,
      title: "Logout",
      link: "/dashboard/logout",
      activeIndex: 8,
      onClick: () => {
        removeFCMToken();
        history.push("/dashboard/logout");
      },
    },
  ];

  useEffect(() => {
    [...drawerItems].forEach((route) => {
      switch (window.location.pathname) {
        case `${route.link}`:
          if (selectedItemIndex !== route.activeIndex) {
            setSelectedItemIndex(route.activeIndex);
          }
          break;
        default:
          break;
      }
    });
  }, [setSelectedItemIndex, selectedItemIndex, drawerItems]);

  return (
    <Drawer
      variant="permanent"
      // open={true}
      BackdropProps={{ invisible: true }}
      elevation={0}
      className={clsx(classes.drawer)}
      classes={{
        paper: classes.drawerPapper,
      }}
    >
      <List>
        <ListItem>
          <img src={logo} alt="logo" className={classes.logo} />
        </ListItem>
        {drawerItems.map((item, index) => (
          <MenuItem
            key={index.toString()}
            selected={selectedItemIndex === index}
            // className={selectedItemIndex === index ? classes.activeItem : null}
            // classes={{ selected: { background: 'linear-gradient(45deg, red 30%, orange 90%)' } }}

            button
            onClick={item.onClick}
            className={classes.drawerItem}
          >
            <ListItemIcon>
              <img src={item.icon} alt="icons" className={classes.drawerIcon} />
            </ListItemIcon>

            <ListItemText
              className={classes.listItemText}
              primary={item.title}
            />
          </MenuItem>
        ))}
      </List>
    </Drawer>
  );
};

export default withRouter(SideDrawer);
const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  drawer: {
    width: drawerWidth,
  },
  drawerIcon: {
    padding: 7,
  },
  drawerPapper: {
    border: "none",
    width: drawerWidth,
    backgroundColor: "#1D244D",
  },
  drawerItem: {
    margin: 16,
    height: 56,
    borderRadius: 8,
    "&.MuiListItem-root.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.1) !important",
    },
  },
  listItemText: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Avenir",
    color: "#fff",
  },
  logo: {
    width: 125,
    // height: 58,
    paddingLeft: "1.5em",
    paddingTop: "1.5em",
  },
}));
