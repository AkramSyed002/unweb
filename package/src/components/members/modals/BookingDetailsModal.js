import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Button,
  Grid,
  Divider,
  Select,
  Chip,
  Fab,
  MenuItem,
  TextField,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PersonIcon from "@material-ui/icons/Person";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Scrollbar from "react-scrollbars-custom";
import moment from "moment";
import { convertToDateString } from "../../../utils/utils";


const RenderIcon = ({ style, Icon, title }) => (
  <Grid item container style={{ marginTop: 17 }}>
    <Icon style={{ color: "#1D244D" }} />
    <Typography className={style}>{title}</Typography>
  </Grid>
);

export default function BookingDetailsModal({
  bookingDetailsModal,
  handleBookingDetailsModalClose,
  booking,
}) {
  const classes = useStyles();

  // const [status, setStatus] = useState(booking.status);

  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value);
  // };

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
          <Grid item>
            <Typography className={classes.bookingTitle}>
              Booking Details
            </Typography>
            <Typography className={classes.bookingTime}>
              {`Time of booking request is ${moment(
                convertToDateString(booking.created_at)
              ).format("hh:mm A")} on ${moment(
                convertToDateString(booking.created_at)
              ).format("ddd MMM DD, YYYY")}`}
            </Typography>
          </Grid>
          <Grid item>
            <Select
              id="status"
              variant="outlined"
              defaultValue={booking.status}
              className={classes.detailsStatusSelect}
              // onChange={handleStatusChange}
              style={{
                backgroundColor:
                  booking.status === "pending"
                    ? "#D5AB45"
                    : booking.status === "cancelled"
                      ? "#FF8888"
                      : booking.status === "completed"
                        ? "#70C78D"
                        : booking.status === "confirmed"
                          ? "#77A7DF"
                          : booking.status === "no_show"
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
              <MenuItem value="pending" style={{ color: "#D5AB45" }}>
                Pending
              </MenuItem>
              <MenuItem value="cancelled" style={{ color: "#FF8888" }}>
                Cancelled
              </MenuItem>
              <MenuItem value="completed" style={{ color: "#70C78D" }}>
                Completed
              </MenuItem>
              <MenuItem value="confirmed" style={{ color: "#77A7DF" }}>
                Confirmed
              </MenuItem>
              <MenuItem value="no_show" style={{ color: "#727272" }}>
                No-Show
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid item container>
          <Typography className={classes.bookingSubTitle}>
            Reservation Details
          </Typography>
        </Grid>
        <Divider light />
        <Grid item container direction="column">
          <RenderIcon
            style={classes.restTitle}
            Icon={LocationOnIcon}
            title={booking.restaurant_name}
          />
          <RenderIcon
            style={classes.restSubTitle}
            Icon={DateRangeIcon}
            title={moment(
              convertToDateString(booking.booking_timestamp)
            ).format("ddd MMM DD, YYYY")}
          />
          <RenderIcon
            style={classes.restSubTitle}
            Icon={AccessTimeIcon}
            title={moment(convertToDateString(booking.created_at)).format(
              "hh:mm A"
            )}
          />
          <RenderIcon
            style={classes.restSubTitle}
            Icon={PersonIcon}
            title={booking.guests}
          />
          <RenderIcon
            style={classes.restSubTitle}
            Icon={InsertDriveFileIcon}
            title={booking.special_requirements}
          />
          {booking.status === "cancelled" && (
            <Grid item container>
              <Typography className={classes.cancelText}>
                Cancelled booking at 9:15 AM on Saturday January 1, 2021
              </Typography>
            </Grid>
          )}
          <Grid item container>
            <Typography className={classes.cancelText} style={{ fontStyle: 'italic' }}>
              Cancelled booking at 9:15 AM on Saturday January 1, 2021
            </Typography>
          </Grid>
          <Grid item container>
            <Typography className={classes.noteTitle}>NOTES</Typography>
            <TextField

              fullWidth
              variant="outlined"
              multiline
              rows={3}
              placeholder="Only you can see this"
              InputProps={{
                className: classes.textFieldText,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Scrollbar>
  );

  return (
    <Modal open={bookingDetailsModal} onClose={handleBookingDetailsModalClose}>
      {body}
    </Modal>
  );
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 715,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    top: "2.5em",
    left: "35%",
    textAlign: "center",
    borderRadius: 16,
  },
  title: {
    // color: "#727272",
    color: "#000",
    fontSize: 20,
    fontWeight: 500,
    // marginTop: 15,
    marginBottom: 16,
  },
  bookingTitle: {
    // color: "#353535",
    color: "#000",
    fontSize: 28,
    fontWeight: 700,
    width: 220,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  bookingSubTitle: {
    // color: "#353535",
    color: "#000",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 30,
    fontFamily: "Avenir",
    fontStyle: "normal"
  },
  bookingTime: {
    // color: "#C0C0C0",
    color: "#000",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "Avenir",
    fontStyle: "normal"
  },
  detailsStatusSelect: {
    width: 229,
    height: 32,
    marginLeft: 30,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 12,
    color: "#fff",
  },
  restTitle: {
    color: "#727272",
    fontWeight: 700,
    fontSize: 16,
    marginLeft: 20,
    fontFamily: "Avenir",
    fontStyle: "normal"
  },
  restSubTitle: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    marginLeft: 20,
    fontFamily: "Avenir",
    fontStyle: "normal"
  },
  cancelText: {
    color: "#FF8888",
    fontSize: 16,
    fontWeight: 500,
    marginTop: 12,
  },
  noteTitle: {
    // color: "#C0C0C0",
    color: "#000",
    fontWeight: 500,
    fontSize: 13,
    marginTop: 24,
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: "#727272",
    color: "#000",
    fontFamily: "Avenir",
    fontStyle: "normal"

  },
  fabButton: {
    marginTop: -40,
    marginRight: -50,
    background: "#1D244D",
    color: "#fff",
  },
}));
