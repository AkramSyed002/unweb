import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  Switch,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { NotificationStatusInitial, USER_ROLES } from "../../constants";
import {
  sendNotificationToAllMembers,
  updateUserNotificationStatusesByID,
} from "../../firebase/services";
import { useAppContext } from "../../context/AppContext";
import LoadingModal from "../members/modals/LoadingModal";
const useStyles = makeStyles((theme) => ({
  headerTitle: {
    marginTop: 110,
    marginBottom: 10,
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
  },
  updateButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 180,
    height: 32,
    borderRadius: 4,
    marginBottom: 16,
  },
  infoContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 48,
  },
  credentialTitle: {
    color: "#727272",
    fontSize: 22,
    fontWeight: 500,
    fontFamily: "Avenir",
  },
  notificationTitle: {
    color: "#353535",
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 16,
    width: "42%",
    fontFamily: "Avenir",
  },
  divider: {
    // marginTop: 16,
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    // color: '#C0C0C0',
    color: "#000",
    marginBottom: 4,
  },
  textField: {
    width: 400,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
    // color: '#C0C0C0',
    color: "#000",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: '#727272',
    color: "#000",
  },
  countryCodeSelect: {
    width: 110,
    background: "#fff",
  },
  notiItem: {
    color: "#727272",
    fontSize: 16,
    fontWeight: 500,
    width: "42%",
    fontFamily: "Avenir",
  },
  filterIcon: {
    border: "#C0C0C0 solid 1px",
    borderRadius: 4,
    color: "#C0C0C0",
    marginBottom: 5,
  },
}));

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 48,
    height: 23,
    padding: 0,
    border: "2px solid #AECFEF",
    borderRadius: 100,
    marginLeft: 20,
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(24px)",
      color: "#5EA0E0",
      "& + $track": {
        backgroundColor: "#5EA0E0",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
    },
  },
  thumb: {
    width: 16,
    height: 16,
    color: "#AECFEF",
  },
  track: {
    borderRadius: 26 / 2,
    background: "#fff",
    opacity: 0.5,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export const MemberMarketing = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    if (title === "") return alert("Please enter title");
    if (message === "") return alert("Please enter message");
    sendNotificationToAllMembers(title, "marketing", message, null);
    alert("Notification sent to all members");
  };

  if (loading) return <LoadingModal modalVisible={true} />;
  return (
    <Grid container>
      <Grid item container direction="column" className={classes.infoContainer}>
        <Fragment>
          <Typography className={classes.credentialTitle}>
            Send custom notification
          </Typography>
          <Divider light className={classes.divider} />

          <Grid
            item
            style={{ backgroundColor: "white", padding: "2%", borderRadius: 8 }}
          >
            <RenderTextField
              label={"Title"}
              classes={classes}
              placeholder="Title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              style={{ width: 335 }}
            />
            <RenderTextField
              label={"Message"}
              classes={classes}
              placeholder="Message"
              value={message}
              onChange={({ target }) => setMessage(target.value)}
              style={{ width: 335, marginTop: 12 }}
              multiline
            />

            <Button
              disabled={loading}
              onClick={sendNotification}
              variant="contained"
              className={classes.updateButton}
              disableElevation
              style={{ width: 335, marginTop: 12 }}
            >
              Send Notification
            </Button>
          </Grid>
        </Fragment>
      </Grid>
    </Grid>
  );
};

const RenderTextField = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  onChange,
  secureText,
  multiline,
}) => (
  <Grid item container direction="column" style={style}>
    {/* <label className={classes.label}>{label}</label> */}
    <TextField
      multiline={multiline}
      rows={5}
      inputProps={{ maxLength: multiline ? 178 : 65 }}
      helperText={multiline ? `${value.length}/178` : `${value.length}/65`}
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      // className={classes.textField}
      InputProps={
        {
          // className: classes.textFieldText,
        }
      }
      onChange={onChange}
      type={secureText ? "password" : "text"}
    />
  </Grid>
);
