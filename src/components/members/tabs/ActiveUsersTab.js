import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";

import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import NavigateNextOutlinedIcon from "@material-ui/icons/NavigateNextOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";

import ActiveUsersTable from "./ActiveUsersTable";
import {
  getSectionNotifications,
  updateNotification,
} from "../../../firebase/services";
import moment from "moment";
import { convertToDateString } from "../../../utils/utils";
import { RenderNotification } from "../../RenderNotification";

const ActiveUsersTab = ({ activeMembers }) => {
  const classes = useStyles();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const _fetchNotifications = async () => {
      let notificationsArray = await getSectionNotifications("member");
      setNotifications(notificationsArray);
    };
    _fetchNotifications();
  }, []);

  const readNotification = async (index) => {
    let temp = [...notifications];
    let seen_at = new Date();
    temp[index].seen_at = seen_at;

    try {
      await updateNotification(temp[index].notificationId, { seen_at });
      temp.splice(index, 1);
      setNotifications(temp);
    } catch (error) {
      console.log("Error updating notifications", error.message);
    }
  };

  return (
    <Grid container direction="column">
      <Grid
        item
        container
        alignItems="center"
        className={classes.notificationContainer}
      >
        <Typography className={classes.title}>
          Notifications{" "}
          {notifications && (
            <a className={classes.notifications}>{notifications.length} new</a>
          )}
        </Typography>
        {showNotifications ? (
          <Fragment>
            <ExpandMoreOutlinedIcon
              fontSize="large"
              className={classes.expandIcon}
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications &&
              notifications.map((el, i) => {
                if (el.seen_at === null) {
                  return (
                    <RenderNotification
                      classes={classes}
                      avatar={el.user_avatar}
                      userName={el.issuer_user_id === el.target_user_id ? "You" : el.user_name}
                      actionMessage={el.description}
                      time={moment(
                        convertToDateString(el.created_at)
                      ).fromNow()}
                      onCrossClick={() => readNotification(i)}
                    />
                  );
                }
              })}
          </Fragment>
        ) : (
          <NavigateNextOutlinedIcon
            fontSize="large"
            className={classes.expandIcon}
            onClick={() => setShowNotifications(!showNotifications)}
          />
        )}
      </Grid>
      <ActiveUsersTable activeMembers={activeMembers} />
    </Grid>
  );
};

export default ActiveUsersTab;
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
    paddingLeft: "2%",
    fontFamily: "AvenirBold",
    fontStyle: "normal",
  },
  notifications: {
    color: "#FF8888",
    marginLeft: 16,
    fontFamily: "AvenirBold",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 22,
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
