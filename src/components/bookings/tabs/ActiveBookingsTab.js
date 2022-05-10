import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Grid, Typography, Box } from "@material-ui/core";

import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import NavigateNextOutlinedIcon from "@material-ui/icons/NavigateNextOutlined";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";
import CalendarTodayOutlined from "@material-ui/icons/CalendarTodayOutlined";
import LocationCityOutlined from "@material-ui/icons/LocationCityOutlined";
import PersonIcon from "@material-ui/icons/Person";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import { BOOKING_STATUS } from "../../../constants";
import BookingDetailsModal from "../modals/BookingDetailsModal";
import { convertToDateString, getArrayByStatus } from "../../../utils/utils";
import moment from "moment";
import { useAppContext } from "../../../context/AppContext";
import {
  deleteBooking,
  getSectionNotifications,
  sendNotificationToBasicUsers,
  sendNotificationToLiveUsers,
  sendNotificationToMember,
  updateBooking,
  updateBookingStatus,
  updateNotification,
} from "../../../firebase/services";
import { RenderNotification } from "../../RenderNotification";
import LoadingModal from "../../members/modals/LoadingModal";

const useStyles = makeStyles((theme) => ({
  notificationContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    // marginBottom: 24,
    // paddingTop: 24,
    // paddingBottom: 24,
    // height: 78,
    marginLeft: "1.5%",
    marginRight: "1.5%",
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#353535",
    paddingLeft: "0.4%",
    fontFamily: "Avenir",
  },
  notifications: {
    color: "#FF8888",
    marginLeft: 16,
  },
  expandIcon: {
    marginLeft: "auto",
    marginRight: "1%",
  },
  notiTitle: {
    color: "#353535",
    fontSize: 15,
  },
  notificationData: {
    background: "#fff",
    marginTop: 14,
    marginBottom: 14,
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
    height: 180,
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
    fontSize: 12,
    width: 80,
    height: 20,
    background: "#FF8888",
    marginRight: -22,
    marginBottom: -5,
    position: "absolute",
    padding: 4,
    color: "#fff",
    textAlign: "center",
    borderRadius: "0px 8px",
  },
}));

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
  const { bookings, setBookings, selectedRestaurant } = useAppContext();
  const [loading, setLoading] = useState(false);

  const onStatusChange = async (value, oldStatus) => {
    setLoading(true);
    try {
      await updateBookingStatus(selectedCard.id, value);
      setSelectedCard((preState) => ({ ...preState, status: value }));
      const temp = [...bookings];
      const index = temp.findIndex((el) => el.id === selectedCard.id);
      temp[index].status = value;
      setBookings(temp);
      setSelectedCard(null);
      setLoading(false);
      if (value === "no_show" || value === "cancelled") {
        sendNotificationToLiveUsers(
          "booking",
          `'has changed booking status to' ${value}`,
          selectedCard.id
        );
        sendNotificationToBasicUsers(
          "booking",
          `'has changed booking status to' ${value}`,
          selectedCard.id,
          selectedCard.restaurant_id
        );
      }

      if (value === "cancelled") {
        sendNotificationToMember(
          "Booking cancelled",
          "booking",
          `Your reservation at ${selectedCard.restaurant_name} on ${moment(
            convertToDateString(selectedCard.booking_timestamp)
          ).format("DD/MM/YYYY")} at ${moment(
            convertToDateString(selectedCard.booking_timestamp)
          ).format("hh:mma")} has now been cancelled`,
          selectedCard.user_id,
          selectedCard.id
        );
      }
      if (value === "confirmed") {
        sendNotificationToMember(
          "Booking confirmed",
          "booking",
          `You have a an upcoming reservation for ${
            selectedCard.restaurant_name
          } on the ${moment(
            convertToDateString(selectedCard.booking_timestamp)
          ).format("DD/MM/YYYY")} at ${moment(
            convertToDateString(selectedCard.booking_timestamp)
          ).format("hh:mma")} for ${
            selectedCard.guests
          } guests. If you are unable to attend please cancel`,
          selectedCard.user_id,
          selectedCard.id
        );
      }
      if (value === "reject") {
        sendNotificationToMember(
          "Booking cannot be completed",
          "booking",
          `Your reservation at ${selectedCard.restaurant_name} on ${moment(
            convertToDateString(selectedCard.booking_timestamp)
          ).format("DD/MM/YYYY")} at ${moment(
            convertToDateString(selectedCard.booking_timestamp)
          ).format(
            "hh:mma"
          )} is not possible. One of the unome team will now contact you now.`,
          selectedCard.user_id,
          selectedCard.id
        );
      }
    } catch (error) {
      setLoading(false);
      console.log("Error updating status", error.message);
    }
  };

  const onDeleteBooking = async () => {
    try {
      await deleteBooking(selectedCard.id);
      sendNotificationToLiveUsers(
        "booking",
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

  const onEditBooking = async (booking, oldBookingTime, oldBookingGuests) => {
    try {
      booking.last_updated_at = new Date();
      await updateBooking(booking);
      const temp = [...bookings];
      const index = temp.findIndex((el) => el.id === selectedCard.id);
      // Check if restaurant has been changed remove it from current bookings
      if (selectedRestaurant.id === booking.restaurant_id) {
        temp[index] = booking;
        setBookings(temp);
      } else {
        temp.splice(index, 1);
        setBookings(temp);
      }
      sendNotificationToBasicUsers(
        "booking",
        `has created a new reservation for ${booking.user_name} at ${booking.restaurant_name}`,
        booking.id,
        booking.restaurant_id
      );
      sendNotificationToLiveUsers(
        "booking",
        `has updated reservation for ${booking.user_name} at ${booking.restaurant_name}`,
        booking.id
      );
      if (booking.booking_timestamp !== oldBookingTime) {
        sendNotificationToMember(
          "Booking time changed",
          "booking",
          `Your reservation at ${
            booking.restaurant_name
          } has been amended from ${moment(oldBookingTime).format(
            "DD/MM/YYYY hh:mm A"
          )} to ${moment(booking.booking_timestamp).format(
            "DD/MM/YYYY"
          )} at ${moment(booking.booking_timestamp).format("hh:mm A")}`,
          booking.user_id,
          booking.id
        );
      }
      let guests_update_message = null;
      if (booking.guests < oldBookingGuests)
        guests_update_message = `Your reservation at ${booking.restaurant_name} has been decreased from ${oldBookingGuests} to ${booking.guests} guests`;
      else if (booking.guests > oldBookingGuests)
        guests_update_message = `Your reservation at ${booking.restaurant_name} has been increased from ${oldBookingGuests} to ${booking.guests}`;

      if (guests_update_message) {
        sendNotificationToMember(
          "Booking guests changed",
          "booking",
          guests_update_message,
          booking.user_id,
          booking.id
        );
      }

      setSelectedCard(null);
    } catch (error) {
      console.log("error updating booking", error.message);
    }
  };

  return (
    <Fragment>
      {loading && <LoadingModal modalVisible={true} />}
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
      {selectedCard && (
        <BookingDetailsModal
          card={selectedCard}
          bookingDetailsModal={selectedCard ? true : false}
          handleBookingDetailsModalClose={() => setSelectedCard(null)}
          onStatusChange={onStatusChange}
          onDeleteBooking={onDeleteBooking}
          onEditBooking={onEditBooking}
        />
      )}
    </Fragment>
  );
};

const RenderTitle = ({ classes, title, count }) => (
  <Typography className={classes.statusTitle}>
    {title} <a className={classes.countText}>{count}</a>
  </Typography>
);

const RenderButton = ({ classes, buttonText, onClick }) => (
  <Button disableElevation onClick={onClick} className={classes.addNewButton}>
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
          {moment(convertToDateString(card.created_at)).format("DD/MM hh:mm")}
        </Typography>
      )}
    </Grid>
    <Grid item container display="flex" alignItems="center">
      <Avatar src={card.user_avatar} style={{ width: 70, height: 70 }} />
      <Box marginLeft={3}>
        <Typography color="primary">{card.user_name}</Typography>
        <Typography>{card.date}</Typography>
        <Typography>
          <CalendarTodayOutlined className={classes.timeIcon} />
          {moment(convertToDateString(card.booking_timestamp)).format(
            "ddd Do MMMM"
          )}
        </Typography>
        <Typography>
          <WatchLaterOutlinedIcon className={classes.timeIcon} />
          {moment(convertToDateString(card.booking_timestamp)).format(
            "hh:mm A"
          )}
        </Typography>
        <Typography>
          <LocationCityOutlined className={classes.timeIcon} />
          {card.restaurant_name}
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

  const [notifications, setNotifications] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const _fetchNotifications = async () => {
      let notificationsArray = await getSectionNotifications("booking");

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
    <Grid container spacing={5}>
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
                      userName={
                        el.issuer_user_id === el.target_user_id
                          ? "You"
                          : el.user_name
                      }
                      actionMessage={el.description}
                      // action="booking"
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
      <Grid item md={4}>
        <RenderBookingColumn
          className={classes.bookingColumn}
          classes={classes}
          title="Pending"
          count={getArrayByStatus(bookings, BOOKING_STATUS.PENDING).length}
          buttonText="Add new +"
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
          buttonText="Add new +"
          detailsCardData={getArrayByStatus(bookings, BOOKING_STATUS.CONFIRMED)}
          buttonClick={() => handleBookingModalOpen(BOOKING_STATUS.CONFIRMED)}
        />
      </Grid>

      <Grid item md={4}>
        <RenderBookingColumn
          className={classes.SevenRoomsColumn}
          classes={classes}
          title="Seven Rooms"
          count={getArrayByStatus(bookings, BOOKING_STATUS.SEVEN_ROOMS).length}
          detailsCardData={getArrayByStatus(
            bookings,
            BOOKING_STATUS.SEVEN_ROOMS
          )}
          buttonClick={() => handleBookingModalOpen(BOOKING_STATUS.SEVEN_ROOMS)}
        />
        {/* <RenderBookingColumn
          className={classes.SevenRoomsColumn}
          classes={classes}
          title="SevenRooms"
          count={1}
          detailsCardData={getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length}
        /> */}
      </Grid>
    </Grid>
  );
};

export default ActiveBookingsTab;
