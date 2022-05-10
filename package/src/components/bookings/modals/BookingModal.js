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
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import CloseIcon from "@material-ui/icons/Close";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PersonIcon from "@material-ui/icons/Person";

import BookingConfirmationModal from "./BookingConfirmationModal";
import { useAppContext } from "../../../context/AppContext";
import { BookingInitialData, BOOKING_STATUS } from "../../../constants";
import {
  createBooking,
  sendNotificationToLiveUsers,
} from "../../../firebase/services";
import { convertToDateString } from "../../../utils/utils";
import moment from "moment";
import MembersDropdown from "../MembersDropdown";

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
    marginTop: 40,
    fontFamily: "Avenir",
    // marginBottom: 7,
  },
  bookingTitle: {
    color: "#353535",
    fontSize: 28,
    fontWeight: 700,
    marginTop: -15,
    fontFamily: "Avenir",
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
  textFieldText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#353535",
    fontFamily: "Avenir",
  },
  memberTextFieldText: {
    fontSize: 18,
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
    fontFamily: "Avenir",
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
  onBlur,
  onFocus,
  onChange,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className:
          label === "Member Name"
            ? classes.memberTextFieldText
            : classes.textFieldText,
        startAdornment: indorment,
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
    />
  </Grid>
);

export default function BookingModal({
  bookingModal,
  handleBookingModalClose,
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
  const [allMembers, setAllMembers] = useState(
    members.filter((el) => el.status === "live")
  );
  const [booking, setBooking] = useState(
    bookingItem
      ? Object.assign(BookingInitialData, bookingItem)
      : BookingInitialData
  );
  const [bookingConfirmationModal, setBookingConfirmationModal] =
    useState(false);

  useEffect(() => setLocation(booking.restaurant_name), [booking]);

  const handleBookingConfirmModalOpen = () => {
    setBookingConfirmationModal(true);
  };

  const handleBookingConfirmModalClose = () => {
    setBookingConfirmationModal(false);
  };

  const handleLocationChange = (_, value) => {
    setLocation(value);
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
    handleInputChange(
      "user_name",
      `${allMembers[index].first_name} ${allMembers[index].last_name}`
    );
  };

  const setRestaurant = (index, name) => {
    handleInputChange("restaurant_id", restaurants[index].id);
    handleInputChange("restaurant_name", name);
  };

  const handleInputChange = (key, value) => {
    setBooking((preState) => ({ ...preState, [key]: value }));
  };

  const addNewBooking = async () => {
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

    // Check if current user dont have booking at same time.
    bookings.forEach((el) => {
      if (el.user_id === booking.user_id) {
        var bookingTime = moment(booking.booking_timestamp);
        var checkBookTime = moment(el.booking_timestamp);
        var duration = moment.duration(bookingTime.diff(checkBookTime));
        var hours = duration.asHours();
        if (hours === 0)
          return alert("Member has already booking for same time");
      }
    });

    try {
      setLoading(true);
      console.log(booking);
      const { id } = await createBooking(booking);
      sendNotificationToLiveUsers(
        "booking_created",
        `has created a new reservation for ${booking.user_name} at ${booking.restaurant_name}`,
        id
      );
      booking.id = id;
      let temp = [...bookings];
      temp.push(booking);
      setBookings(temp);
      setLoading(false);
      handleBookingModalClose();
      setBookingConfirmationModal(false);
      setBooking(BookingInitialData);
    } catch (error) {
      setLoading(false);
      console.log("Error creating booking", error.message);
    }
  };

  const body = (
    <Scrollbar style={{ height: 750 }}>
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
          label="Member Name"
          id="memberName"
          placeholder="MEMBER NAME"
          value={memberName}
          onChange={({ target }) => {
            setMemberName(target.value);
            if (memberName == "") {
              setAllMembers(members);
            } else {
              const results = allMembers.filter((res) => {
                // res.firstName.toLowerCase().includes(searchValue)
                return Object.values(res)
                  .join(" ")
                  .toLowerCase()
                  .includes(memberName.toLowerCase());
              });
              setAllMembers(results);
            }
          }}
          onFocus={() => setShowMembersList(true)}
          // onBlur={() => setShowMembersList(false)}
        />
        {showMembersList && (
          <MembersDropdown members={allMembers} setMember={setMember} />
        )}

        <Grid item container>
          <Grid
            item
            container
            direction="row"
            style={{ width: 335, marginTop: -5 }}
          >
            <Typography className={classes.label}>Location</Typography>
            <Autocomplete
              id="tags"
              value={location}
              options={restaurants.map(({ name }) => name)}
              onChange={handleLocationChange}
              style={{ width: 335 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Location"
                />
              )}
            />
          </Grid>
          <Grid
            item
            container
            direction="row"
            style={{ width: 335, marginLeft: 16, marginTop: -5 }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Typography className={classes.label}>Time</Typography>
              <KeyboardTimePicker
                autoOk
                value={new Date(convertToDateString(booking.booking_timestamp))}
                onChange={(date) =>
                  handleInputChange("booking_timestamp", date)
                }
                // value={}
                variant="inline"
                inputVariant="outlined"
                mask="__:__ _M"
                InputAdornmentProps={{ position: "start" }}
                keyboardIcon={<AccessTimeIcon style={{ color: "#5EA0E0" }} />}
                className={classes.textField}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Typography className={classes.label}>Date</Typography>
          <KeyboardDatePicker
            autoOk
            disableToolbar
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={new Date(convertToDateString(booking.booking_timestamp))}
            // disablePast={true}
            InputAdornmentProps={{ position: "start" }}
            keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
            onChange={(date) => handleInputChange("booking_timestamp", date)}
            //   style={{ width: 176, background: "#fff" }}
            className={classes.textField}
          />
        </MuiPickersUtilsProvider>

        <RenderTextField
          classes={classes}
          label="Members"
          id="members"
          placeholder="Members"
          value={booking.guests}
          onChange={({ target }) => handleInputChange("guests", target.value)}
          indorment={
            <InputAdornment position="start">
              <PersonIcon color="primary" />
            </InputAdornment>
          }
        />

        <Typography className={classes.label}>Special Request</Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={1}
          placeholder="Special Requests"
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
          Additional Information
        </Typography>
        <Divider light />
        <Typography className={classes.label}>Additional Notes</Typography>
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
        <FormControlLabel
          classes={{
            label: classes.checkboxLabel,
          }}
          control={
            <Checkbox checked={true} name="notification" color="primary" />
          }
          label="Send user notification of this booking"
        />
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
                onEditBooking(booking);
                handleBookingModalClose();
              }
            : addNewBooking
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
