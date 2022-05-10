import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Button,
  Grid,
  Divider,
  InputAdornment,
  Fab,
  TextField,
  FormControlLabel,
  Checkbox,
  Avatar,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Scrollbar from "react-scrollbars-custom";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import CloseIcon from "@material-ui/icons/Close";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DateRangeIcon from "@material-ui/icons/DateRange";
import PersonIcon from "@material-ui/icons/Person";

import BookingConfirmationModal from "./BookingConfirmationModal";
import { useAppContext } from "../../../context/AppContext";
import { BookingInitialData, BOOKING_STATUS } from "../../../constants";
import {
  createBooking,
  getBookingsByMemberId,
  sendNotificationToBasicUsers,
  sendNotificationToLiveUsers,
  sendNotificationToMember,
} from "../../../firebase/services";
import { convertToDateString, convertToTime } from "../../../utils/utils";
import moment from "moment";
import MembersDropdown from "../MembersDropdown";
import "./bookingModal.css";
import LoadingModal from "../../members/modals/LoadingModal";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    padding: "0px 40px 18px 40px",
    top: 18,
    left: "27%",
    borderRadius: 16,
  },
  title: {
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 20,
    fontFamily: "Avenir",
    // marginBottom: 7,
  },
  bookingTitle: {
    color: "#353535",
    fontSize: 28,
    fontWeight: 700,
    marginTop: -15,
    fontFamily: "AvenirBold",
  },
  saveButton: {
    fontWeight: 600,
    fontSize: 18,
    background: "#5EA0E0",
    color: "#fff",
    textAlign: "center",
    width: 335,
    height: 52,
    fontFamily: "Avenir",
    textTransform: " none",
    "&:hover": {
      color: "#727272",
    },
  },
  cancelButton: {
    fontWeight: 700,
    fontSize: 18,
    color: "##353535",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    border: "2px solid #727272",
    marginRight: 32,
    fontFamily: "Avenir",
  },
  textField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
  },
  timeTextField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#353535",
    fontFamily: "Avenir",
  },
  memberTextFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#5EA0E0",
    fontFamily: "Avenir",
  },
  fabButton: {
    marginTop: -15,
    marginRight: -60,
    background: "#1D244D",
    color: "#fff",
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 6,
    color: "#C0C0C0",
    fontSize: 15,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  checkboxLabel: {
    fontWeight: 700,
    fontSize: 16,
    color: "#353535",
    fontFamily: "Avenir",
  },
}));

const RenderTextField = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  indorment,
  endIndormant,
  onBlur,
  onFocus,
  onChange,
  type,
  disabled,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      disabled={disabled}
      type={type ? type : "text"}
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        inputProps: { min: 0, max: 10 },
        className:
          label === "Member Name"
            ? classes.memberTextFieldText
            : classes.textFieldText,
        startAdornment: indorment,
        endAdornment: endIndormant,
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
    />
  </Grid>
);

let arrayHolder = [];
export default function BookingModal({
  bookingModal,
  closeModal,
  title,
  bookingItem = null,
  bookingStatus,
  onEditBooking,
}) {
  const classes = useStyles();
  const [location, setLocation] = useState("");

  const { members, restaurants, bookings, setBookings } = useAppContext();
  const [memberName, setMemberName] = useState(
    bookingItem ? bookingItem.user_name : ""
  );

  const [showMembersList, setShowMembersList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [allMembers, setAllMembers] = useState([]);
  const [booking, setBooking] = useState(
    bookingItem ? Object.assign({}, bookingItem) : BookingInitialData
  );

  const oldBookingTime = bookingItem ? bookingItem.booking_timestamp : null;
  const oldBookingGuests = bookingItem ? bookingItem.guests : null;

  const [bookingConfirmationModal, setBookingConfirmationModal] =
    useState(false);

  const [isSendNotification, setIsSendNotification] = useState(true);
  const [isSevenRoom, setIsSevenRoom] = useState(false);

  useEffect(() => setLocation(booking.restaurant_name), [booking]);

  useEffect(() => {
    if (members !== null) {
      setAllMembers(members.filter((el) => el.status === "live"));
      arrayHolder = members.filter((el) => el.status === "live");
    }
  }, [members]);

  const handleBookingConfirmModalOpen = () => {
    setBookingConfirmationModal(true);
  };

  const handleBookingConfirmModalClose = () => {
    setBookingConfirmationModal(false);
  };

  const handleLocationChange = (_, value) => {
    setLocation(value);
    if (value === null) return handleInputChange("restaurant_name", "");
    let index = restaurants.findIndex(
      (el) => el.name.toLowerCase() === value.toLowerCase()
    );
    handleInputChange("restaurant_id", restaurants[index].id);
    handleInputChange("restaurant_name", value);
  };

  const setMember = (index) => {
    setMemberName(
      `${allMembers[index].first_name} ${allMembers[index].last_name}`
    );
    setShowMembersList(false);
    handleInputChange("user_id", allMembers[index].id);
    handleInputChange("user_avatar", allMembers[index].profile_image_URL);
    handleInputChange("user_email", allMembers[index].email);
    handleInputChange("user_phone_number", allMembers[index].phone_number);
    handleInputChange(
      "user_name",
      `${allMembers[index].first_name} ${allMembers[index].last_name}`
    );
    handleInputChange("allergies", allMembers[index].allergies);
    handleInputChange(
      "dietary_requirements",
      allMembers[index].dietary_requirements
    );
  };

  const handleInputChange = (key, value) => {
    setBooking((preState) => ({ ...preState, [key]: value }));
  };

  const validateBooking = async () => {
    // Check if current user dont have booking at same time.
    let isAlreadyBooking = false;
    let checkBookTime = "";
    let matchedTimeAndPlace = {
      time: '',
      place: ''
    }
    var bookingTime = moment(booking.booking_timestamp);
    const bookingSnap = await getBookingsByMemberId(booking.user_id);
    bookingSnap.forEach(doc => {
      let el = doc.data();
      checkBookTime = moment(convertToDateString(el.booking_timestamp));
      var duration = moment.duration(bookingTime.diff(checkBookTime));
      var hours = duration.asHours();

      if (Math.abs(hours) <= 3 && !isAlreadyBooking) {
        console.log(moment(bookingTime).format('hh:mm A'), "||", moment(checkBookTime).format('hh:mm A'), Math.abs(hours));
        isAlreadyBooking = true;
        matchedTimeAndPlace = {
          time: checkBookTime.format("ddd MMM DD, YYYY hh:mm A"),
          place: el.restaurant_name
        }
      };
    })

    if (isAlreadyBooking) {
      if (window.confirm(`This member has already a booking in ${matchedTimeAndPlace.place} at ${moment(matchedTimeAndPlace.tim).format(
        "ddd MMM DD, YYYY hh:mm A"
      )}. Do you still want to add the booking?`)) {
        // If still wants to make booking
        if (!bookingItem) // it means its new
          createNewBooking();
        else onEditBooking(booking, oldBookingTime, oldBookingGuests)
      } else console.log('Create Booking Cancelled');
    } else {
      if (!bookingItem) // it means its new
        createNewBooking(); // if bookingItem is not null it means its update as booking has passed here
      else onEditBooking(booking, oldBookingTime, oldBookingGuests)
    }
  };

  const createNewBooking = async () => {
    booking.status = bookingStatus;
    booking.created_at = new Date();
    booking.last_updated_at = new Date();

    if (booking.guests <= 6) {
      if (booking.special_requirements === "") {
        var createdTime = moment(booking.last_updated_at);
        var bookingTime = moment(booking.booking_timestamp);
        var duration = moment.duration(bookingTime.diff(createdTime));
        var hours = duration.asHours();
        if (hours <= 4) {
          booking.status = BOOKING_STATUS.CONFIRMED;
        }
      }
    }

    if (isSevenRoom) booking.status = BOOKING_STATUS.SEVEN_ROOMS;
    try {
      console.log(booking.status);
      setLoading(true);
      const { id } = await createBooking(booking);
      booking.id = id;
      let temp = [...bookings];
      temp.push(booking);
      setBookings(temp);
      handleBookingModalClose();
      setBookingConfirmationModal(false);
      setBooking(Object.assign({}, BookingInitialData));
      setLocation("");
      setMemberName("");
      sendNotificationToBasicUsers(
        "booking",
        `has created a new reservation for ${booking.user_name} at ${booking.restaurant_name}`,
        id,
        booking.restaurant_id
      );
      sendNotificationToLiveUsers(
        "booking",
        `has created a new reservation for ${booking.user_name} at ${booking.restaurant_name}`,
        id
      );
      if (isSendNotification) {
        sendNotificationToMember(
          "New booking",
          "booking",
          `Your reservation at ${booking.restaurant_name} is confirmed on the ${moment(
            booking.booking_timestamp
          ).format("DD/MM/YYYY")} at ${moment(
            booking.booking_timestamp
          ).format("hh:mma")} for ${booking.guests} guests`,
          booking.user_id,
          id
        );
      }
    } catch (error) {
      setLoading(false);
      console.log("Error creating booking", error.message);
    }
  }

  const handleBookingModalClose = () => {
    setLocation("");
    setMemberName("");

    setBooking(Object.assign({}, BookingInitialData));
    closeModal();
  };

  useEffect(() => {
    if (
      booking.user_name === "" ||
      booking.restaurant_name === "" ||
      booking.booking_timestamp === null
    )
      setDisabled(true);
    else setDisabled(false);
  }, [booking]);

  const body = (
    <Scrollbar style={{ height: "100%" }}>

      {loading && <LoadingModal modalVisible={true} />}

      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleBookingModalClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Typography className={classes.bookingTitle}>{title}</Typography>

        <RenderTextField
          classes={classes}
          style={{ width: 335 }}
          disabled={title === "Edit booking"}
          label="Member name *"
          id="memberName"
          placeholder="Member name"
          value={memberName}
          onChange={({ target }) => {
            setMemberName(target.value);
            const newData = arrayHolder.filter((item) => {
              const itemData = `${item?.first_name.toUpperCase()} ${item?.last_name.toUpperCase()}`;
              const textData = target.value.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setAllMembers(newData);
          }}
          onFocus={() => setShowMembersList(true)}
          onCloseMemberList={() => setShowMembersList(true)}
          endIndormant={
            showMembersList ? (
              <CloseIcon
                style={{ color: "#5EA0E0", cursor: "pointer" }}
                onClick={() => setShowMembersList(false)}
              />
            ) : null
          }
        />
        {showMembersList && (
          <MembersDropdown members={allMembers} setMember={setMember} />
        )}

        <Typography className={classes.label}>Location *</Typography>

        <Autocomplete
          id="tags"
          value={location}
          options={restaurants.map(({ name }) => name)}
          onChange={handleLocationChange}
          style={{ width: 335 }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Location" />
          )}
        />

        <Grid item container style={{ marginTop: 10 }}>
          <Grid item container direction="row" style={{ width: 335 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Typography className={classes.label}>Date *</Typography>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                format="MM/dd/yyyy"
                value={
                  !booking.booking_timestamp
                    ? null
                    : new Date(convertToDateString(booking.booking_timestamp))
                }
                InputAdornmentProps={{ position: "start" }}
                keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
                onChange={(date) =>
                  handleInputChange("booking_timestamp", date)
                }
                className={classes.textField}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid
            item
            container
            direction="row"
            style={{ width: 335, marginLeft: 16, marginTop: -5 }}
          >
            {booking.booking_timestamp && (
              <Grid item container style={{ marginTop: 8 }}>
                <Typography className={classes.label}>Time *</Typography>
                <TextField
                  variant="outlined"
                  type="time"
                  className={`input ${classes.timeTextField}`}
                  value={
                    title === "Edit booking"
                      ? moment(
                        convertToDateString(booking.booking_timestamp)
                      ).format("HH:mm")
                      : moment(booking.booking_timestamp).format("HH:mm")
                  }
                  onChange={({ target, key }) => {
                    if (target.value === "") return;
                    let arr = target.value.split(":");
                    let date = new Date(
                      convertToDateString(booking.booking_timestamp)
                    ).setHours(parseInt(arr[0]), parseInt(arr[1]));
                    handleInputChange("booking_timestamp", new Date(date));
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <RenderTextField
          classes={classes}
          type="number"
          label="Guests"
          id="members"
          placeholder="Members"
          min={100}
          value={booking.guests}
          onChange={({ target }) => {
            if (target.value > 0) handleInputChange("guests", target.value);
          }}
          indorment={
            <InputAdornment position="start">
              <PersonIcon color="primary" />
            </InputAdornment>
          }
        />

        <Typography className={classes.label}>Special request</Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={1}
          placeholder="Special requests"
          style={{ width: 684 }}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={booking.special_requirements}
          onChange={({ target }) =>
            handleInputChange("special_requirements", target.value)
          }
        />
        <Typography className={classes.title}>
          Additional information
        </Typography>
        <Divider light />
        <Typography className={classes.label}>Additional notes</Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          placeholder="Only you can see this"
          style={{ width: 684 }}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={booking.additional_notes}
          onChange={({ target }) =>
            handleInputChange("additional_notes", target.value)
          }
        />
        {!bookingItem && <FormControlLabel
          classes={{
            label: classes.checkboxLabel,
          }}
          control={
            <Checkbox
              onChange={() => setIsSevenRoom(!isSevenRoom)}
              checked={isSevenRoom}
              name="notification"
              color="primary"
            />
          }
          label="Seven rooms"
        />}
        {!bookingItem && <FormControlLabel
          classes={{
            label: classes.checkboxLabel,
          }}
          control={
            <Checkbox
              onChange={() => setIsSendNotification(!isSendNotification)}
              checked={isSendNotification}
              name="notification"
              color="primary"
            />
          }
          label="Send user notification of this booking"
        />}

        <Grid item container justify="center" style={{ marginTop: 30 }}>
          <Button
            className={classes.cancelButton}
            onClick={handleBookingModalClose}
          >
            Cancel
          </Button>
          <Button
            className={classes.saveButton}
            onClick={handleBookingConfirmModalOpen}
            disabled={disabled}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
      <BookingConfirmationModal
        bookingConfirmationModal={bookingConfirmationModal}
        handleBookingConfirmationModalClose={handleBookingConfirmModalClose}
        handleBookingModalClose={handleBookingModalClose}
        card={booking}
        onSavePress={
          bookingItem
            ? () => {
              validateBooking(booking, oldBookingTime, oldBookingGuests);
              handleBookingModalClose();
            }
            : validateBooking
        }
        descriptionChange={(value) => handleInputChange("description", value)}
        onTypeChange={(value) => handleInputChange("type", value)}
      />
    </Scrollbar>
  );

  return (
    <Modal open={bookingModal} onClose={handleBookingModalClose}>
      {body}
    </Modal>
  );
}
