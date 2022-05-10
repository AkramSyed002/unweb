import React, { Fragment } from "react";
import { Avatar, Button, Grid, Typography } from "@material-ui/core";

import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";

import profileImage from "../../../assets/images/memberProfileImage.png";
import { useAppContext } from "../../../context/AppContext";
import moment from "moment";
import { convertToDateString } from "../../../utils/utils";
import { updateNotification } from "../../../firebase/services";

const RenderNotification = ({
  classes,
  avatar,
  userName,
  actionMessage,
  action,
  time,
  onCrossClick,
}) => (
  <Grid container className={classes.notificationData}>
    {avatar && (
      <Avatar src={avatar} style={{ width: 43, height: 43, marginRight: 17 }} />
    )}
    <Typography className={classes.notiTitle}>
      <span style={{ fontWeight: 600 }}>{userName}</span> {actionMessage}
      <span style={{ fontWeight: 600, color: "#5EA0E0" }}> {action}</span>
      <br />
      <WatchLaterOutlinedIcon style={{ color: "#C0C0C0", marginBottom: -5 }} />
      <a style={{ color: "#C0C0C0" }}>{time}</a>
    </Typography>
    <CloseOutlinedIcon
      onClick={onCrossClick}
      style={{ marginLeft: "auto", marginTop: 8 }}
    />
  </Grid>
);

const Notifications = ({ classes }) => {
  const { notifications, setNotifications } = useAppContext();

  const getNotificationsLength = (array, status) => {
    if (status === "unread") {
      return array.filter(function (s) {
        return s.seen_at === null;
      }).length;
    } else {
      return array.filter(function (s) {
        return s.seen_at !== null;
      }).length;
    }
  };

  const readNotification = async (index) => {
    let temp = [...notifications];
    let seen_at = new Date();
    temp[index].seen_at = seen_at;
    console.log(temp[index].id);
    try {
      await updateNotification(temp[index].id, { seen_at });
      setNotifications(temp);
    } catch (error) {
      console.log("Error updating notifications", error.message);
    }
  };

  const markAllRead = () => {
    let temp = [...notifications];
    let seen_at = new Date();
    temp = temp.map((el) => (el.seen_at ? el : { ...el, seen_at }));
    // Update Firebase
  };

  return (
    <Fragment>
      <Grid item container>
        <Button
          onClick={markAllRead}
          variant="text"
          className={classes.markasReadButton}
        >
          Mark all as Read
        </Button>
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        className={classes.notificationContainer}
      >
        <Typography className={classes.title}>
          Unread
          <span className={classes.notifications}>
            {getNotificationsLength(notifications, "unread")}
          </span>
        </Typography>
        {notifications &&
          notifications.map((el, i) => {
            if (el.seen_at === null) {
              return (
                <RenderNotification
                  classes={classes}
                  avatar={el.user_avatar}
                  userName={el.user_name}
                  actionMessage={el.description}
                  // action="booking"
                  time={moment(convertToDateString(el.created_at)).fromNow()}
                  onCrossClick={() => readNotification(i)}
                />
              );
            }
          })}
      </Grid>
      {/* <Grid
        item
        container
        alignItems="center"
        className={classes.notificationContainer}
      >
        <Typography className={classes.title}>
          Read{" "}
          <span className={classes.notifications}>
            {getNotificationsLength(notifications, "read")}
          </span>
        </Typography>
        {notifications &&
          notifications.map((el, i) => {
            if (el.seen_at !== null) {
              return (
                <RenderNotification
                  classes={classes}
                  avatar={el.user_avatar}
                  userName={el.user_name}
                  actionMessage={el.description}
                  // action="booking"
                  time={moment(convertToDateString(el.created_at)).fromNow()}
                  onCrossClick={() => readNotification(i)}
                />
              );
            }
          })}
      </Grid> */}
      <Grid>
        <Button variant="text" className={classes.exportCSVButton}>
          Export .CSV
        </Button>
      </Grid>
    </Fragment>
  );
};

export default Notifications;
