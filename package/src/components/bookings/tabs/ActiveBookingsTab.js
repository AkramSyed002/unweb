import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Grid, Typography, Box } from "@material-ui/core";

import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import NavigateNextOutlinedIcon from "@material-ui/icons/NavigateNextOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";
import PersonIcon from "@material-ui/icons/Person";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import { sevenRoomsCardData, BOOKING_STATUS } from "../../../constants";
import BookingDetailsModal from "../modals/BookingDetailsModal";
import { convertToDateString, getArrayByStatus } from "../../../utils/utils";
import moment from "moment";
import { useAppContext } from "../../../context/AppContext";
import {
  deleteBooking,
  sendNotificationToBasicUsers,
  sendNotificationToLiveUsers,
  updateBooking,
  updateBookingStatus,
} from "../../../firebase/services";

const useStyles = makeStyles((theme) => ({
  notificationContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    // marginBottom: 24,
    // paddingTop: 24,
    // paddingBottom: 24,
    // height: 78,
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#353535",
    paddingLeft: 40,
    fontFamily: "Avenir",
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
  bookingColumn: {
    // height: 650,
    // width: 340,
    background: "#F8F8F8",
    borderRadius: 16,
    // top: 16,
    padding: "23px 16px 32px 16px",
  },
  confirmedColumn: {
    // height: 810,
    width: 340,
    background: "#F8F8F8",
    borderRadius: 16,
    top: 16,
    padding: "23px 16px 32px 16px",
  },
  SevenRoomsColumn: {
    // height: 265,
    // width: 340,
    background: "#F8F8F8",
    borderRadius: 16,
    // top: 16,
    padding: "23px 16px 32px 16px",
  },
  statusTitle: {
    fontWeight: 700,
    fontSize: 25,
    color: "#353535",
    paddingLeft: 10,
    marginBottom: 15,
    fontFamily: "Avenir",
  },
  addNewButton: {
    border: "2px dashed #C0C0C0",
    height: 55,
    color: "#727272",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
  },
  countText: {
    color: "#C0C0C0",
  },
  detailsCard: {
    height: 144,
    borderRadius: 8,
    background: "#fff",
    marginTop: 16,
    padding: 22,
    color: "#727272",
    cursor: "pointer",
  },
  timeIcon: {
    marginBottom: -6,
    width: 18,
    marginRight: 5,
    color: "#727272",
  },
  pendingMinutes: {
    width: 57,
    height: 30,
    background: "#FF8888",
    marginRight: -22,
    marginBottom: -16,
    position: "absolute",
    padding: 4,
    color: "#fff",
    textAlign: "center",
    borderRadius: "0px 8px",
  },
}));

const RenderNotification = ({ classes }) => (
  <Grid container className={classes.notificationData}>
    <Typography className={classes.notiTitle}>
      <a style={{ fontWeight: 700, fontFamily: "Avenir", fontSize: 20 }}>
        Zac Efron
      </a>
      made changes to his
      <a style={{ fontWeight: 600, color: "#5EA0E0", fontFamily: "Avenir" }}>
        &nbsp; booking.
      </a>
      <br />
      <WatchLaterOutlinedIcon className={classes.timeIcon} />
      <a style={{ color: "#C0C0C0" }}>16m</a>
    </Typography>
    <CloseOutlinedIcon style={{ marginLeft: "auto", marginTop: 8 }} />
  </Grid>
);

const RenderBookingColumn = ({
  className,
  classes,
  title,
  count,
  buttonText,
  buttonClick,
  detailsCardData,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const { bookings, setBookings } = useAppContext();

  const onStatusChange = async (value) => {
    try {
      if (value === "no_show" || value === "cancelled") {
        sendNotificationToLiveUsers(
          "booking_status_change",
          `'has changed booking status to' ${value}`,
          selectedCard.id
        );
        sendNotificationToBasicUsers(
          "booking_status_change",
          `'has changed booking status to' ${value}`,
          selectedCard.id,
          selectedCard.restaurant_id
        );
      }
      await updateBookingStatus(selectedCard.id, value);
      setSelectedCard((preState) => ({ ...preState, status: value }));
      const temp = [...bookings];
      const index = temp.findIndex((el) => el.id === selectedCard.id);
      temp[index].status = value;
      setBookings(temp);
    } catch (error) {
      console.log("Error updating status", error.message);
    }
  };

  const onDeleteBooking = async () => {
    try {
      await deleteBooking(selectedCard.id);
      sendNotificationToLiveUsers(
        "booking_deleted",
        `has deleted reservation of ${selectedCard.user_name} at ${selectedCard.restaurant_name}`
      );
      setSelectedCard(null);
      const temp = [...bookings];
      const index = temp.findIndex((el) => el.id === selectedCard.id);
      temp.splice(index, 1);
      setBookings(temp);
    } catch (error) {
      console.log("Error updating status", error.message);
    }
  };

  const onEditBooking = async (booking) => {
    try {
      booking.last_updated_at = new Date();
      await updateBooking(booking);
      const temp = [...bookings];
      const index = temp.findIndex((el) => el.id === selectedCard.id);
      temp[index] = booking;
      setBookings(temp);
      setSelectedCard(null);
    } catch (error) {
      console.log("error updating booking", error.message);
    }
  };

  return (
    <Fragment>
      <Grid item container direction="column" className={className}>
        <RenderTitle title={title} count={count} classes={classes} />
        {buttonText ? (
          <RenderButton
            classes={classes}
            buttonText={buttonText}
            onClick={buttonClick}
          />
        ) : null}
        {detailsCardData &&
          detailsCardData.map((card, index) => (
            <RenderDetailsCard
              classes={classes}
              card={card}
              index={index}
              //booking modal funs
              handleBookingDetailsModalOpen={(card) => setSelectedCard(card)}
            />
          ))}
      </Grid>
      <BookingDetailsModal
        card={selectedCard}
        bookingDetailsModal={selectedCard ? true : false}
        handleBookingDetailsModalClose={() => setSelectedCard(null)}
        onStatusChange={onStatusChange}
        onDeleteBooking={onDeleteBooking}
        onEditBooking={onEditBooking}
      />
    </Fragment>
  );
};

const RenderTitle = ({ classes, title, count }) => (
  <Typography className={classes.statusTitle}>
    {title} <a className={classes.countText}>{count}</a>
  </Typography>
);

const RenderButton = ({ classes, buttonText, onClick }) => (
  <Button onClick={onClick} className={classes.addNewButton}>
    {buttonText}
  </Button>
);

const RenderDetailsCard = ({
  classes,
  card,
  index,
  //booking modal funs
  handleBookingDetailsModalOpen,
}) => (
  <Grid
    item
    container
    key={index}
    className={classes.detailsCard}
    onClick={() => {
      handleBookingDetailsModalOpen(card);
    }}
  >
    <Grid item container alignItems="flex-end" justify="flex-end">
      {card.booking_timestamp && (
        <Typography className={classes.pendingMinutes}>
          {moment(convertToDateString(card.created_at)).format("hh:mm")}
        </Typography>
      )}
    </Grid>
    <Grid item container display="flex" alignItems="center">
      <Avatar src={card.user_avatar} style={{ width: 70, height: 70 }} />
      <Box marginLeft={3}>
        <Typography color="primary">{card.user_name}</Typography>
        <Typography>{card.date}</Typography>
        <Typography>
          <WatchLaterOutlinedIcon className={classes.timeIcon} />
          {moment(convertToDateString(card.booking_timestamp)).format(
            "hh:mm A"
          )}
        </Typography>
      </Box>
    </Grid>
    <Grid item container direction="column" style={{ color: "#727272" }}></Grid>
    <Grid item container style={{ marginTop: 20, paddingBottom: 20 }}>
      <Typography>
        <PersonIcon className={classes.timeIcon} />
        {card.guests}
      </Typography>

      {card.special_requirements && (
        <Typography>
          <InsertDriveFileIcon
            className={classes.timeIcon}
            style={{ color: "#70C78D", marginLeft: 27 }}
          />
          Special Requests
        </Typography>
      )}
    </Grid>
  </Grid>
);

const ActiveBookingsTab = ({ bookings, handleBookingModalOpen }) => {
  const classes = useStyles();

  const [notifications, setNotifications] = useState(false);

  const handleClick = () => {
    setNotifications(!notifications);
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} className={classes.notificationContainer}>
        <Box display="flex">
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
        </Box>
      </Grid>
      <Grid item md={4}>
        <RenderBookingColumn
          className={classes.bookingColumn}
          classes={classes}
          title="Pending"
          count={getArrayByStatus(bookings, BOOKING_STATUS.PENDING).length}
          buttonText="Add New +"
          detailsCardData={getArrayByStatus(bookings, BOOKING_STATUS.PENDING)}
          buttonClick={() => handleBookingModalOpen(BOOKING_STATUS.PENDING)}
        />
      </Grid>
      <Grid item md={4}>
        <RenderBookingColumn
          className={classes.bookingColumn}
          classes={classes}
          title="Confirmed"
          count={getArrayByStatus(bookings, BOOKING_STATUS.CONFIRMED).length}
          buttonText="Add New +"
          detailsCardData={getArrayByStatus(bookings, BOOKING_STATUS.CONFIRMED)}
          buttonClick={() => handleBookingModalOpen(BOOKING_STATUS.CONFIRMED)}
        />
      </Grid>
      <Grid item md={4}>
        <RenderBookingColumn
          className={classes.SevenRoomsColumn}
          classes={classes}
          title="SevenRooms"
          count={1}
          detailsCardData={sevenRoomsCardData}
        />
      </Grid>
    </Grid>
  );
};

export default ActiveBookingsTab;
