import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Tooltip,
  Switch,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import { USER_ROLES } from "../../constants";

import FilterListIcon from "@material-ui/icons/FilterList";
import PhoneInput from "react-phone-input-2";
import { useAuth } from "../../context/AuthContext";
import { validateEmail } from "../../utils/utils";
import { updateNotificationStatusesByID } from "../../firebase/services";
import { useAppContext } from "../../context/AppContext";

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
    textTransform: "none",
    marginLeft: "auto",
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
    fontFamily: "Avenir",
    color: "#353535",
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 16,
    width: "42%",
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
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
    color: "#000",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: '#C0C0C0',
    color: "#000",
    fontFamily: "Avenir",
  },
  countryCodeSelect: {
    width: 110,
    borderRadius: 8,
    marginBottom: 9,
    background: "#fff",
    marginRight: 4,
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
}))(({ classes, onChange, checked, ...props }) => {
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
      checked={checked}
      onChange={onChange}
      {...props}
    />
  );
});

const RenderTextField = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  onChange,
  secureText,
  disabled
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
        className: classes.textFieldText,
      }}
      onChange={onChange}
      type={secureText ? "password" : "text"}
      disabled={disabled}
    />
  </Grid>
);

const RenderUserCredential = ({
  classes,
  inputHandler,
  userProfile,
  updateEmailClick,
  updatePasswordClick,
  updatePhoneNumberClick,
  updateNameClick,
  loading,
}) => (
  <Fragment>
    <Typography className={classes.credentialTitle}>
      User credentials
    </Typography>
    <Divider light className={classes.divider} />
    <Grid item container direction="row" alignItems="center">
      <RenderTextField
        classes={classes}
        placeholder="First Name"
        value={userProfile.first_name}
        onChange={({ target }) => inputHandler("first_name", target.value)}
        style={{ width: 335 }}
      />
      <RenderTextField
        classes={classes}
        placeholder="Last Name"
        value={userProfile.last_name}
        onChange={({ target }) => inputHandler("last_name", target.value)}
        style={{ width: 335, marginLeft: 10 }}
      />
      <Button
        disabled={loading}
        onClick={updateNameClick}
        variant="contained"
        className={classes.updateButton}
        disableElevation
      >
        Update name
      </Button>
    </Grid>
    <Grid item container direction="row" justifyContent="space-between">
      <RenderTextField
        classes={classes}
        label="Email"
        id="email"
        placeholder="Email"
        value={userProfile.email}
        onChange={({ target }) => inputHandler("email", target.value)}
        style={{ width: 335 }}
      />
      <Grid
        item
        container
        style={{ width: 500 }}
        alignItems="flex-end"
        justifyContent="center"
      >
        <Button
          disableElevation
          disabled={loading}
          onClick={updateEmailClick}
          variant="contained"
          className={classes.updateButton}
        >
          Update Email
        </Button>
      </Grid>
    </Grid>
    <Grid item container justifyContent="space-between">
      <RenderTextField
        classes={classes}
        style={{ width: 335 }}
        label="New password"
        id="newPassword"
        placeholder="New password"
        secureText
        value={userProfile.new_password}
        onChange={({ target }) => inputHandler("new_password", target.value)}
      />
      <Grid
        item
        container
        style={{ width: 500 }}
        alignItems="flex-end"
        justifyContent="center"
      >
        <Button
          disabled={loading}
          onClick={updatePasswordClick}
          variant="contained"
          className={classes.updateButton}
          disableElevation
        >
          Update Password
        </Button>
      </Grid>
    </Grid>
    <Grid item container>
      <label className={classes.label}>Phone number</label>
    </Grid>

    <Grid item container justifyContent="space-between">
      <Grid item container style={{ width: 330 }}>
        <PhoneInput
          inputStyle={{
            width: "100%",
            height: "56px",
            fontSize: 16,
            fontWeight: 700,
            // color: '#C0C0C0',
            color: "#000",
            fontFamily: "Avenir",
          }}
          value={userProfile.phone_number}
          onChange={(value) => inputHandler("phone_number", value)}
        />
      </Grid>
      <Grid
        item
        container
        style={{ width: 500 }}
        alignItems="flex-end"
        justifyContent="center"
      >
        <Button
          disabled={loading}
          onClick={updatePhoneNumberClick}
          variant="contained"
          className={classes.updateButton}
          disableElevation
        >
          Update Phone
        </Button>
      </Grid>
    </Grid>

    <Grid item container justifyContent="space-between">
      <RenderTextField
        classes={classes}
        style={{ width: 335 }}
        label="Role"
        id="role"
        placeholder="Role"      
        value={userProfile.role}        
        disabled
      />
    </Grid>
  </Fragment>
);

export const PersonalTab = () => {
  const classes = useStyles();

  const [countryCode, setCountryCode] = useState("1");
  const [showSmsNotification, setShowSmsNotification] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [showInAppNotification, setShowInAppNotification] = useState(false);
  const {
    currentAuth,
    currentUser,
    setCurrentUser,
    changePassword,
    changeEmail,
    changePhone,
    changeName,
  } = useAuth();
  const { notificationsStatuses, setNotificationsStatuses } = useAppContext();
  
  const [userProfile, setUserProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    old_password: "",
    new_password: "",
    phone_number: "",
    role: ""
  });

  const [loading, setLoading] = useState(false);

  const isSuperAdmin = currentUser?.role == USER_ROLES.SUPER_ADMIN;

  useEffect(() => {
    if (currentUser) {
      handleInputChange("email", currentUser.email);
      handleInputChange("phone_number", currentUser.phone_number);
      handleInputChange("first_name", currentUser.first_name);
      handleInputChange("last_name", currentUser.last_name);
      handleInputChange("role", currentUser.role);
    }
  }, [currentUser]);

  const handleNotificationExpand = (e) => {
    switch (e.target.id) {
      case "sms":
        setShowSmsNotification(!showSmsNotification);
        break;
      case "email":
        setShowEmailNotification(!showEmailNotification);
        break;
      case "inApp":
        setShowInAppNotification(!showInAppNotification);
        break;
    }
  };

  const handleInputChange = (key, value) => {
    setUserProfile((preState) => ({ ...preState, [key]: value }));
  };

  const updateUserEmail = async () => {
    if (userProfile.email !== currentAuth.email) {
      if (!validateEmail(userProfile.email))
        return alert("Invalid Email Address");
      try {
        setLoading(true);
        await changeEmail(userProfile.email);
        setLoading(false);
        alert("User Email Updated");
      } catch (error) {
        alert(error.message);
        setLoading(false);
      }
    }
  };

  const updateUserPassword = async () => {
    if (userProfile.new_password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      try {
        setLoading(true);
        await changePassword(userProfile.new_password);
        setLoading(false);
        alert("User Password Updated");
      } catch (error) {
        setLoading(false);
        alert(error.message);
      }
    } else alert('Password must be Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character');


  };

  const updateUserPhone = async () => {
    try {
      setLoading(true);
      await changePhone(userProfile.phone_number);
      setLoading(false);
      let temp = Object.assign({}, currentUser);
      temp.phone_number = userProfile.phone_number;
      setCurrentUser(temp);
      alert("User Phone Number Updated");
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const updateUserName = async () => {
    try {
      setLoading(true);
      await changeName(userProfile.first_name, userProfile.last_name);
      setLoading(false);
      let temp = Object.assign({}, currentUser);
      temp.first_name = userProfile.first_name;
      temp.last_name = userProfile.last_name;
      setCurrentUser(temp);
      alert("Name Updated");
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const handleSwitchChange = (i) => {
    let temp = [...notificationsStatuses];
    temp[i].value = !temp[i].value;
    setNotificationsStatuses(temp);
  };

  const handleNotificationsUpdate = async () => {
    try {
      setLoading(true);
      await updateNotificationStatusesByID(
        currentAuth.uid,
        notificationsStatuses
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (!notificationsStatuses) return <div />;

  return (
    <Grid container>
      <Grid item container direction="column" className={classes.infoContainer}>
        <RenderUserCredential
          classes={classes}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          inputHandler={handleInputChange}
          userProfile={userProfile}
          updateEmailClick={updateUserEmail}
          updatePasswordClick={updateUserPassword}
          updatePhoneNumberClick={updateUserPhone}
          updateNameClick={updateUserName}
          loading={loading}
        />
      </Grid>
      <Grid item container direction="column" className={classes.infoContainer}>
        <Grid item container direction="row" justifyContent="space-between">
          <Typography className={classes.notificationTitle}>
            Notifications
          </Typography>
          <Button
            variant="contained"
            className={classes.updateButton}
            onClick={handleNotificationsUpdate}
            disabled={loading}
            disableElevation
          >
            Update
          </Button>
        </Grid>
        <Divider light className={classes.divider} />

        {/* Start */}
        <Grid container direction="column" style={{ marginBottom: 60 }}>
          <Grid item container>
            <Typography className={classes.notificationTitle}>
              SMS notifications
            </Typography>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: "transparent" }}
            >
              <FilterListIcon
                id={"sms"}
                onClick={handleNotificationExpand}
                className={classes.filterIcon}
              />
            </IconButton>
          </Grid>
          {showSmsNotification && (
            <Fragment>
              {notificationsStatuses &&
                notificationsStatuses.map(
                  (el, i) =>
                    (isSuperAdmin
                      ? el.type === "sms"
                      : el.type === "sms" && Boolean(el.visibility)) && (
                      <Grid
                        key={i.toString()}
                        item
                        container
                        style={{ marginBottom: 8 }}
                      >
                        <Typography className={classes.notiItem}>
                          {el.title}
                        </Typography>

                        <IOSSwitch
                          checked={el.value}
                          onChange={() => handleSwitchChange(i)}
                        />
                      </Grid>
                    )
                )}
            </Fragment>
          )}
        </Grid>
        {/* Start */}
        <Grid container direction="column" style={{ marginBottom: 60 }}>
          <Grid item container>
            <Typography className={classes.notificationTitle}>
              Email notifications
            </Typography>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: "transparent" }}
            >
              <FilterListIcon
                onClick={handleNotificationExpand}
                id={"email"}
                className={classes.filterIcon}
              />
            </IconButton>
          </Grid>
          {showEmailNotification && (
            <Fragment>
              {notificationsStatuses &&
                notificationsStatuses.map(
                  (el, i) =>
                    (isSuperAdmin
                      ? el.type === "email"
                      : el.type === "email" && Boolean(el.visibility)) && (
                      <Grid item container style={{ marginBottom: 8 }}>
                        <Typography className={classes.notiItem}>
                          {el.title}
                        </Typography>

                        <IOSSwitch
                          checked={el.value}
                          onChange={() => handleSwitchChange(i)}
                        />
                      </Grid>
                    )
                )}
            </Fragment>
          )}
        </Grid>
        {/* Start */}
        <Grid container direction="column" style={{ marginBottom: 60 }}>
          <Grid item container>
            <Typography className={classes.notificationTitle}>
              In app notifications
            </Typography>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: "transparent" }}
            >
              <FilterListIcon
                onClick={handleNotificationExpand}
                id={"inApp"}
                className={classes.filterIcon}
              />
            </IconButton>
          </Grid>
          {showInAppNotification && (
            <Fragment>
              {notificationsStatuses &&
                notificationsStatuses.map(
                  (el, i) =>
                    (isSuperAdmin
                      ? el.type === "in_app"
                      : el.type === "in_app" && Boolean(el.visibility)) && (
                      <Grid item container style={{ marginBottom: 8 }}>
                        <Typography className={classes.notiItem}>
                          {el.title}
                        </Typography>
                        <IOSSwitch
                          checked={el.value}
                          onChange={() => handleSwitchChange(i)}
                        />
                      </Grid>
                    )
                )}
            </Fragment>
          )}
        </Grid>
        {/* End */}
      </Grid>
    </Grid>
  );
};
