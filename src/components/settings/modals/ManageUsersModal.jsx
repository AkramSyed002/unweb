import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import {
  Typography,
  Modal,
  Button,
  Grid,
  Fab,
  Divider,
  IconButton,
  Checkbox,
  Switch,
} from "@material-ui/core";
import Scrollbar from "react-scrollbars-custom";
import FilterListIcon from "@material-ui/icons/FilterList";

import CloseIcon from "@material-ui/icons/Close";
import {
  getNotificationStatusesByID,
  updateUserNotificationStatusByID,
} from "../../../firebase/services";
import { NotificationStatusInitial } from "../../../constants";

export default function ManageUsersModal({
  openModal,
  closeModal,
  selectedMembers,
  setLoading,
}) {
  const classes = useStyles();
  const [notificationsStatuses, setNotificationsStatuses] = useState(null);
  const [showSmsNotification, setShowSmsNotification] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [showInAppNotification, setShowInAppNotification] = useState(false);

  useEffect(() => {
    const getStatuses = async () => {
      const notificationStatusInitial = [...NotificationStatusInitial];
      const doc = await getNotificationStatusesByID(selectedMembers.id);

      if (!doc.exists) setNotificationsStatuses(notificationStatusInitial);
      else
        setNotificationsStatuses(
          Object.assign(NotificationStatusInitial, doc.data().statuses)
        );
    };
    getStatuses();
  }, []);

  const handleSwitchChange = (i) => {
    let temp = [...notificationsStatuses];
    temp[i].value = !temp[i].value;
    setNotificationsStatuses(temp);
  };

  const handleCheckboxChange = (i) => {
    let temp = [...notificationsStatuses];
    temp[i].visibility = !temp[i].visibility;
    setNotificationsStatuses(temp);
  };

  const handleNotificationsUpdate = async () => {
    try {
      setLoading(true);
      await updateUserNotificationStatusByID(
        selectedMembers.id,
        notificationsStatuses
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setNotificationsStatuses(null);
    closeModal();
  };

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

      default:
        break;
    }
  };

  const body = (
    <Scrollbar style={{ height: "100%" }}>
      <Grid
        container
        direction="column"
        style={{
          marginLeft: "300px",
          marginTop: "50px",
          width: `70%`,
        }}
      >
        <Grid
          item
          container
          direction="column"
          className={classes.infoContainer}
        >
          <Grid item container alignItems="flex-start" justify="space-between">
            <Typography className={classes.headerTitle}>
              {selectedMembers?.first_name} {selectedMembers?.last_name}
            </Typography>
            <Fab
              aria-label="add"
              elevation={0}
              onClick={handleModalClose}
              style={{ marginTop: "-5%", marginRight: "-1%" }}
            >
              <CloseIcon />
            </Fab>
          </Grid>
          <Grid item container direction="row">
            <Typography className={classes.notificationTitle}></Typography>
            <Button
              variant="contained"
              className={classes.updateButton}
              onClick={handleNotificationsUpdate}
              disabled={!selectedMembers}
            >
              Update
            </Button>
          </Grid>
          <Divider light className={classes.divider} />

          {notificationsStatuses && (
            <>
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
                      onClick={handleNotificationExpand}
                      id={"sms"}
                      className={classes.filterIcon}
                    />
                  </IconButton>
                </Grid>
                {showSmsNotification && (
                  <Fragment>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      style={{ marginBottom: 8, width: "52%" }}
                    >
                      <Typography
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#C0C0C0",
                          marginRight: 23,
                          fontFamily: "Avenir",
                        }}
                      >
                        Visibility
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#C0C0C0",
                          fontFamily: "Avenir",
                        }}
                      >
                        Value
                      </Typography>
                    </Grid>
                    {notificationsStatuses &&
                      notificationsStatuses.map(
                        (el, i) =>
                          el.type === "sms" && (
                            <Grid
                              key={i.toString()}
                              item
                              container
                              style={{ marginBottom: 8 }}
                            >
                              <Typography className={classes.notiItem}>
                                {el.title}
                              </Typography>
                              <Checkbox
                                disabled={!selectedMembers}
                                checked={el.visibility}
                                onChange={() => handleCheckboxChange(i)}
                                color="primary"
                                style={{ marginTop: -10 }}
                              />
                              <IOSSwitch
                                checked={el.value}
                                onChange={() => handleSwitchChange(i)}
                                disabled={!selectedMembers}
                              />
                            </Grid>
                          )
                      )}
                  </Fragment>
                )}
              </Grid>

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
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      style={{ marginBottom: 8, width: "52%" }}
                    >
                      <Typography
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#C0C0C0",
                          marginRight: 23,
                          fontFamily: "Avenir",
                        }}
                      >
                        Visibility
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#C0C0C0",
                          fontFamily: "Avenir",
                        }}
                      >
                        Value
                      </Typography>
                    </Grid>
                    {notificationsStatuses &&
                      notificationsStatuses.map(
                        (el, i) =>
                          el.type === "email" && (
                            <Grid
                              key={i.toString()}
                              item
                              container
                              style={{ marginBottom: 8 }}
                            >
                              <Typography className={classes.notiItem}>
                                {el.title}
                              </Typography>
                              <Checkbox
                                disabled={!selectedMembers}
                                checked={el.visibility}
                                onChange={() => handleCheckboxChange(i)}
                                color="primary"
                                style={{ marginTop: -10 }}
                              />
                              <IOSSwitch
                                checked={el.value}
                                disabled={!selectedMembers}
                                onChange={() => handleSwitchChange(i)}
                              />
                            </Grid>
                          )
                      )}
                  </Fragment>
                )}
              </Grid>

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
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      style={{ marginBottom: 8, width: "52%" }}
                    >
                      <Typography
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#C0C0C0",
                          marginRight: 23,
                          fontFamily: "Avenir",
                        }}
                      >
                        Visibility
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#C0C0C0",
                          fontFamily: "Avenir",
                        }}
                      >
                        Value
                      </Typography>
                    </Grid>
                    {notificationsStatuses &&
                      notificationsStatuses.map(
                        (el, i) =>
                          el.type === "in_app" && (
                            <Grid
                              key={i.toString()}
                              item
                              container
                              style={{ marginBottom: 8 }}
                            >
                              <Typography className={classes.notiItem}>
                                {el.title}
                              </Typography>
                              <Checkbox
                                disabled={!selectedMembers}
                                checked={el.visibility}
                                onChange={() => handleCheckboxChange(i)}
                                color="primary"
                                style={{ marginTop: -10 }}
                              />
                              <IOSSwitch
                                disabled={!selectedMembers}
                                checked={el.value}
                                onChange={() => handleSwitchChange(i)}
                              />
                            </Grid>
                          )
                      )}
                  </Fragment>
                )}
              </Grid>
            </>
          )}
        </Grid>
        {/* my code end here */}
      </Grid>
    </Scrollbar>
  );

  // if(!notificationsStatuses) return <div />

  return (
    <Modal open={openModal} onClose={handleModalClose}>
      {body}
    </Modal>
  );
}

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
const useStyles = makeStyles((theme) => ({
  headerTitle: {
    marginBottom: 10,
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
  },
  updateButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 180,
    height: 32,
    borderRadius: 4,
    marginBottom: 16,
    marginTop: 6,
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
    fontSize: 20,
    fontWeight: 500,
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
    width: 334,
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
