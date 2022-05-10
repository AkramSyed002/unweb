import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";

import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import NavigateNextOutlinedIcon from "@material-ui/icons/NavigateNextOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";

import PendingUsersTable from "./PendingUsersTable";

const useStyles = makeStyles((theme) => ({
  notificationContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    marginBottom: 24,
    paddingTop: 24,
    paddingBottom: 24,
    // height: 78,
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#353535",
    paddingLeft: 40,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  notifications: {
    color: "#FF8888",
    marginLeft: 16,
  },
  expandIcon: {
    marginLeft: "auto",
    marginRight: 43,
  },
  notiTitle: {
    color: "#353535",
    fontSize: 15,
  },
  notificationData: {
    background: "#fff",
    margin: 14,
    borderRadius: 8,
    height: 75,
    padding: 16,
  },
}));

const RenderNotification = ({ classes }) => (
  <Grid container className={classes.notificationData}>
    <Typography className={classes.notiTitle}>
      <a style={{ fontWeight: 600 }}>Afolabi David</a> updated his
      <a style={{ fontWeight: 600 }}> phone number.</a>{" "}
      <a style={{ fontWeight: 600, color: "#5EA0E0" }}> View Profile</a>
      <br />
      <WatchLaterOutlinedIcon style={{ color: "#C0C0C0", marginBottom: -5 }} />
      <a style={{ color: "#C0C0C0" }}>16m</a>
    </Typography>
    <CloseOutlinedIcon style={{ marginLeft: "auto", marginTop: 8 }} />
  </Grid>
);

const PendingUsersTab = ({ users, pendingMembers }) => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState(false);

  const handleClick = () => {
    setNotifications(!notifications);
  };

  return (
    <Grid container direction="column">
      {/* <Grid
        item
        container
        alignItems="center"
        className={classes.notificationContainer}
      >
        <Typography className={classes.title}>
          Notifications <a className={classes.notifications}>2 new</a>
        </Typography>
        {notifications ? (
          <Fragment>
            <ExpandMoreOutlinedIcon
              fontSize="large"
              className={classes.expandIcon}
              onClick={handleClick}
            />
            <RenderNotification classes={classes} />
            <RenderNotification classes={classes} />
          </Fragment>
        ) : (
          <NavigateNextOutlinedIcon
            fontSize="large"
            className={classes.expandIcon}
            onClick={handleClick}
          />
        )}
      </Grid> */}
      <PendingUsersTable users={users} pendingMembers={pendingMembers} />
    </Grid>
  );
};

export default PendingUsersTab;
