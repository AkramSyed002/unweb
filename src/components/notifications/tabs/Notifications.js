import React, { Fragment, useState } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useAppContext } from "../../../context/AppContext";
import moment from "moment";
import { convertToDateString } from "../../../utils/utils";
import { markAllNotifications, updateNotification } from "../../../firebase/services";
import { RenderNotification } from "../../RenderNotification";
import LoadingModal from "../../members/modals/LoadingModal";



const Notifications = ({ classes }) => {
  const { notifications, setNotifications } = useAppContext();
  console.log(notifications)
  const [loading, setLoading] = useState(false);

  const readNotification = async (index) => {
    let temp = [...notifications];
    let seen_at = new Date();
    temp[index].seen_at = seen_at;
    try {
      await updateNotification(temp[index].notificationId, { seen_at });
      setNotifications(temp);
      console.log(temp)
    } catch (error) {
      console.log("Error updating notifications", error.message);
    }
  };

  const markAllRead = async () => {

    try {
      setLoading(true);
      await markAllNotifications(notifications);
      setLoading(false)
      setNotifications([]);
    } catch (error) {
      setLoading(false)
      console.log("Error marking all read", error)
    }


  };


  if (loading) return <LoadingModal modalVisible={true} />
  return (
    <Fragment>
      <Grid item container>
        <Button
          onClick={markAllRead}
          variant="text"
          className={classes.markasReadButton}
        >
          Mark all as read
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
            {notifications && notifications.length}
          </span>
        </Typography>
        {notifications &&
          notifications.map((el, i) => {
            if (el.seen_at === null) {
              return (
                <RenderNotification
                  classes={classes}
                  avatar={el.user_avatar}
                  userName={el.issuer_user_id === el.target_user_id ? "You" : el.user_name}
                  actionMessage={el.description}
                  // action="booking"
                  time={moment(convertToDateString(el.created_at)).fromNow()}
                  onCrossClick={() => readNotification(i)}
                />
              );
            }
          })}
      </Grid>
    </Fragment>
  );
};

export default Notifications;
