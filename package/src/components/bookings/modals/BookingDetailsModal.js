import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Select,
  Grid,
  Divider,
  MenuItem,
  Fab,
  TextField,
  Avatar,
  Button,
  Chip,
} from "@material-ui/core";
import { Scrollbar } from "react-scrollbars-custom";

import CloseIcon from "@material-ui/icons/Close";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PersonIcon from "@material-ui/icons/Person";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import profile from "../../../assets/images/bookingDetailsProfile.png";
import DeleteBookingModal from "./DeleteBookingModal";
import BookingModal from "./BookingModal";
import moment from "moment";
import { convertToDateString, isItemInArray } from "../../../utils/utils";
import { BOOKING_STATUS, USER_ROLES } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    padding: "0px 40px 30px 40px",
    top: 50,
    left: "27%",
    borderRadius: 16,
  },
  title: {
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 10,
    // marginBottom: 7,
  },
  bookingTitle: {
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
    marginTop: -10,
    marginRight: "auto",
    fontFamily: "Avenir",
  },
  bookingSubTitle: {
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 20,
  },
  bookingTime: {
    color: "#C0C0C0",
    fontSize: 13,
    fontWeight: 700,
  },
  detailsStatusSelect: {
    width: 229,
    height: 32,
    marginLeft: 30,
    borderRadius: 4,
    // marginBottom: 12,
    // marginTop: 12,
    color: "#fff",
  },
  restTitle: {
    color: "#727272",
    fontWeight: 700,
    fontSize: 16,
    marginLeft: 15,
  },
  restSubTitle: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    marginLeft: 15,
    width: "85%",
  },
  cancelText: {
    color: "#FF8888",
    fontSize: 16,
    fontWeight: 500,
    marginTop: 12,
  },
  noteTitle: {
    color: "#C0C0C0",
    fontWeight: 500,
    fontSize: 13,
    marginTop: 24,
  },
  textField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#727272",
  },
  fabButton: {
    marginTop: -20,
    marginRight: -60,
    background: "#1D244D",
    color: "#fff",
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 16,
    color: "#C0C0C0",
  },
  checkboxLabel: {
    fontWeight: 700,
    fontSize: 16,
    color: "#353535",
  },
  avatar: {
    width: 200,
    height: 200,
    marginTop: 8,
  },
  chip: {
    border: "1.5px solid #353535",
    borderRadius: 8,
    background: "#fff",
    marginRight: 10,
  },
  subTitle: {
    color: "#727272",
    textAlign: "center",
    marginBottom: 5,
  },
}));

const RenderIcon = ({ style, Icon, title }) => (
  <Grid item container style={{ marginTop: 10 }}>
    <Icon style={{ color: "#1D244D" }} />
    <Typography className={style}>{title}</Typography>
  </Grid>
);

const RenderReservationDetails = ({ card, classes }) => (
  <Grid item container direction="column" style={{ width: 320 }}>
    <Typography className={classes.bookingSubTitle}>
      Reservation Details
    </Typography>
    <Divider light />
    <RenderIcon
      style={classes.restTitle}
      Icon={LocationOnIcon}
      title={card.restaurant_name}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={DateRangeIcon}
      title={moment(convertToDateString(card.booking_timestamp)).format(
        "ddd MMM DD, YYYY"
      )}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={AccessTimeIcon}
      title={moment(convertToDateString(card.booking_timestamp)).format(
        "hh:mm A"
      )}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={PersonIcon}
      title={card.guests}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={InsertDriveFileIcon}
      title={card.special_requirements}
    />

    <Grid item container>
      <Typography className={classes.noteTitle}>ADDITIONAL NOTES</Typography>
      <TextField
        value={card.additional_notes}
        fullWidth
        variant="outlined"
        multiline
        rows={2}
        placeholder="Only you can see this"
        InputProps={{
          className: classes.textFieldText,
        }}
      />
    </Grid>
  </Grid>
);

const RenderMemberInfo = ({ classes, card }) => (
  <Grid item container direction="column" style={{ width: 320 }}>
    <Typography className={classes.bookingSubTitle}>
      Member Information
    </Typography>
    <Divider light />
    <Grid item container direction="column" alignItems="center">
      <Avatar src={card.user_avatar} className={classes.avatar} />
      <Typography variant="subtitle1" color="primary">
        {card.user_name}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        {card.user_email}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        {card.user_phone_number}
      </Typography>
      <Typography
        variant="body2"
        className={classes.subTitle}
        style={{ color: "#C0C0C0", fontStyle: "italic" }}
      >
        {card.special_requirements}
      </Typography>
    </Grid>
    <Typography className={classes.label}>Allergies</Typography>
    <Grid item container>
      {card.guest_allergies &&
        card.guest_allergies.map((el, i) => (
          <Chip key={i.toString()} label={el} className={classes.chip} />
        ))}
    </Grid>
    <Typography className={classes.label}>Dietary Requirements</Typography>
    <Grid item container>
      {card.guest_dietary_requirements &&
        card.guest_dietary_requirements.map((el, i) => (
          <Chip key={i.toString()} label={el} className={classes.chip} />
        ))}
    </Grid>
  </Grid>
);

export default function BookingDetailsModal({
  bookingDetailsModal,
  handleBookingDetailsModalClose,
  card,
  onStatusChange,
  onEditBooking,
  onDeleteBooking,
}) {
  const classes = useStyles();

  const [deleteBookingModal, setDeleteBookingModal] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const { currentUser } = useAuth();

  const handleDeleteBookingModalOpen = () => {
    setDeleteBookingModal(true);
  };

  const handleDeleteBookingModalClose = () => {
    setDeleteBookingModal(false);
  };

  const handleBookingModalOpen = () => {
    setBookingModal(true);
  };

  const handleBookingModalClose = () => {
    setBookingModal(false);
  };

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleBookingDetailsModalClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Grid item container>
          <Typography className={classes.bookingTitle}>
            Booking Details
          </Typography>
          <Grid item>
            <Select
              id="status"
              variant="outlined"
              value={card && card.status}
              defaultValue={card && card.status}
              className={classes.detailsStatusSelect}
              onChange={({ target }) => onStatusChange(target.value)}
              style={{
                backgroundColor:
                  card && card.status === BOOKING_STATUS.PENDING
                    ? "#FFDC88"
                    : card && card.status === BOOKING_STATUS.COMPLETED
                    ? "#70C78D"
                    : card && card.status === BOOKING_STATUS.CONFIRMED
                    ? "#5EA0E0"
                    : card && card.status === BOOKING_STATUS.CANCELLED
                    ? "#FF8888"
                    : card && card.status === BOOKING_STATUS.NO_SHOW
                    ? "#727272"
                    : "#727272",
              }}
              margin="dense"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem
                value={BOOKING_STATUS.PENDING}
                style={{ color: "#FFDC88" }}
              >
                Pending
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.CANCELLED}
                style={{ color: "#FF8888" }}
              >
                Cancelled
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.COMPLETED}
                style={{ color: "#70C78D" }}
              >
                Completed
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.CONFIRMED}
                style={{ color: "#5EA0E0" }}
              >
                Confirmed
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.NO_SHOW}
                style={{ color: "#727272" }}
              >
                No-show
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid item container justify="space-between">
          <RenderMemberInfo classes={classes} card={card} />
          <RenderReservationDetails card={card} classes={classes} />
        </Grid>
        <Grid item container justifyContent="flex-end">
          <Button variant="text" onClick={handleBookingModalOpen}>
            <EditIcon />
          </Button>

          {isItemInArray(
            [
              USER_ROLES.ADMIN,
              USER_ROLES.RESERVATIONS_MANAGER,
              USER_ROLES.RESERVATIONS_SUPERVISOR,
            ],
            currentUser.role
          ) && (
            <Button variant="text" onClick={handleDeleteBookingModalOpen}>
              <DeleteIcon />
            </Button>
          )}
        </Grid>
        <DeleteBookingModal
          deleteBookingModal={deleteBookingModal}
          handleDeleteBookingModalClose={handleDeleteBookingModalClose}
          onDeleteBooking={onDeleteBooking}
        />
      </Grid>
      <BookingModal
        bookingModal={bookingModal}
        handleBookingModalClose={handleBookingModalClose}
        title="Edit booking"
        bookingItem={card}
        onEditBooking={onEditBooking}
      />
    </Scrollbar>
  );

  return (
    <Modal open={bookingDetailsModal} onClose={handleBookingDetailsModalClose}>
      {body}
    </Modal>
  );
}
