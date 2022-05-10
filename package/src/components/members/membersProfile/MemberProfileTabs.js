import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Button,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  MenuItem,
  Select,
  Divider,
  Checkbox,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

import crown from "../../../assets/icons/crown.png";
import ProfileTab from "./tabs/ProfileTab";
import AlertModal from "../modals/AlertModal";
import BookingHistoryTab from "./tabs/BookingHistoryTab";
import ActivityLogTab from "./tabs/ActivityLogTab";
import { ROUTES } from "../../../constants/routes";
import { useAppContext } from "../../../context/AppContext";
import {
  deleteMemberByID,
  sendNotificationToAllUsers,
  updateFirestoreDocument,
  updateMemberByID,
} from "../../../firebase/services";
import { CollectionNames, USER_ROLES } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const RenderSelect = ({
  classes,
  status,
  isVipMember,
  handleStatusChange,
  handleVipStatus,
  disabled,
}) => (
  <Select
    id="status"
    variant="outlined"
    defaultValue={status}
    className={classes.locationStatusSelect}
    onChange={handleStatusChange}
    disabled={disabled}
    style={{
      backgroundColor:
        status === "live"
          ? "#70C78D"
          : status === "pending"
          ? "#CF9F2B"
          : status === "suspended"
          ? "#FF8888"
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
    <MenuItem style={{ color: "#C0C0C0" }} disabled>
      Mark as
    </MenuItem>
    <Typography style={{ marginLeft: 16, color: "#727272" }}>
      VIP Member <img src={crown} alt="crown" />
      <Checkbox
        checked={isVipMember}
        onChange={handleVipStatus}
        color="primary"
        style={{ marginLeft: 60 }}
      />
    </Typography>
    <Divider light />
    <MenuItem
      value="live"
      className={classes.item}
      style={{ color: "#70C78D" }}
    >
      Live
    </MenuItem>
    <MenuItem
      value="pending"
      className={classes.item}
      style={{ color: "#CF9F2B" }}
    >
      Pending
    </MenuItem>
    <MenuItem
      value="suspended"
      className={classes.item}
      style={{ color: "#FF8888" }}
    >
      Suspended
    </MenuItem>
    <MenuItem
      value="cancelled"
      className={classes.item}
      style={{ color: "#727272" }}
    >
      Cancelled
    </MenuItem>
    <MenuItem
      value="frozen"
      className={classes.item}
      style={{ color: "#727272" }}
    >
      Frozen
    </MenuItem>
    <MenuItem
      value="expired"
      className={classes.item}
      style={{ color: "#727272" }}
    >
      Expired
    </MenuItem>
    <MenuItem
      value="terminated"
      className={classes.item}
      style={{ color: "#727272" }}
    >
      Terminated
    </MenuItem>
  </Select>
);

export default function MemberProfileTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [isVipMember, setVipMember] = useState(
    location.state.user.isVipMember || false
  );
  const { members, setMembers } = useAppContext();
  const { currentUser } = useAuth();

  const [status, setStatus] = useState(location.state.user.status);
  const [deleteMemberModal, setDeleteMemberModal] = useState(false);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleStatusChange = async ({ target }) => {
    console.log(target.value);

    try {
      let temp = [...members];
      let index = temp.findIndex((el) => el.id === location.state.user.id);
      temp[index].status = target.value;
      await updateFirestoreDocument(CollectionNames.USERS, temp[index]);
      setStatus(target.value);
      setMembers(temp);
      if (target.value === "cancelled") {
        sendNotificationToAllUsers(
          "member_profile_delete",
          `has cancelled ${location.state.user.first_name} ${location.state.user.last_name} profile`,
          location.state.user.id
        );
      }
    } catch (error) {
      console.log("Error updating member status", error.message);
    }
  };

  const handleVipStatus = async ({ target: { checked } }) => {
    try {
      let temp = [...members];
      let index = temp.findIndex((el) => el.id === location.state.user.id);
      console.log(temp[index]);
      temp[index].isVipMember = checked;
      temp[index].status = status;
      await updateFirestoreDocument(CollectionNames.USERS, temp[index]);
      setVipMember(checked);
      setMembers(temp);
    } catch (error) {
      console.log("Error updating member status", error.message);
    }
  };

  const handleDeleteMemberModalOpen = () => {
    setDeleteMemberModal(true);
  };

  const handleDeleteMemberModalClose = () => {
    setDeleteMemberModal(false);
  };

  const handleEditMember = () => {
    history.push(ROUTES.MEMBER_VIEW, { member: location.state.user });
  };

  const onConfirmDelete = async () => {
    await deleteMemberByID(location.state.user.id);
    sendNotificationToAllUsers(
      "member_profile_delete",
      `has been deleted ${location.state.user.first_name} ${location.state.user.last_name} profile`
    );
    const index = members.findIndex((el) => el.id === location.state.user.id);
    console.log(index);
    let temp = [...members];
    temp.splice(index, 1);
    setMembers(temp);
    setDeleteMemberModal(false);
    history.push("/dashboard/manage-members");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="#fff" elevation={0}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          indicatorColor="none"
          textColor="none"
          className={classes.tabLine}
        >
          <Tab
            label="Profile"
            classes={{
              root: value === 0 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(0)}
          />
          {currentUser.role !== USER_ROLES.GENERAL_MANAGER && (
            <Tab
              label="Booking history"
              classes={{
                root: value === 1 ? classes.selectedTab : classes.tab,
              }}
              {...a11yProps(1)}
            />
          )}
          {currentUser.role !== USER_ROLES.GENERAL_MANAGER && (
            <Tab
              label="Activity log"
              classes={{
                root: value === 2 ? classes.selectedTab : classes.tab,
              }}
              {...a11yProps(2)}
            />
          )}
          {value === 0 ? (
            <Fragment>
              <RenderSelect
                status={status}
                isVipMember={isVipMember}
                classes={classes}
                handleStatusChange={handleStatusChange}
                handleVipStatus={handleVipStatus}
                disabled={currentUser.role !== USER_ROLES.ADMIN}
              />
              {/* CHECKS */}
              {currentUser.role !== USER_ROLES.GENERAL_MANAGER &&
                currentUser.role !== USER_ROLES.AGENT && (
                  <>
                    {currentUser.role === USER_ROLES.ADMIN && (
                      <Button
                        variant="text"
                        className={classes.deleteButton}
                        onClick={handleDeleteMemberModalOpen}
                      >
                        Delete
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      className={classes.addButton}
                      onClick={handleEditMember}
                    >
                      Edit
                    </Button>
                  </>
                )}
            </Fragment>
          ) : undefined}
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <ProfileTab />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <BookingHistoryTab />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ActivityLogTab />
      </TabPanel>
      <AlertModal
        modalVisible={deleteMemberModal}
        handleClose={handleDeleteMemberModalClose}
        description="Are you sure you want to delete this user?"
        onConfirmClick={onConfirmDelete}
      />
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 25,
    // paddingLeft: 40,
  },
  tabLine: {
    borderRadius: 4,
  },
  selectedTab: {
    color: "#353535",
    // background: "linear-gradient(to top right, #70DED6 30%, #3CB1EA)",
    background: "#E5E5E5",
    borderRadius: 21,
    minWidth: "auto",
    width: "auto",
    minHeight: 37,
    height: 37,
    marginRight: 18,
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  tab: {
    minWidth: "auto",
    width: "auto",
    minHeight: 37,
    height: 37,
    borderRadius: 21,
    marginRight: 18,
    margin: 0,
    textTransform: "capitalize",
    fontSize: 16,
    fontWeight: 700,
    color: "#C0C0C0",
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  addButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  deleteButton: {
    color: "#353535",
    width: 90,
    height: 32,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 500,
    marginRight: 16,
    background: "#E5E5E5",
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  locationStatusSelect: {
    width: 229,
    height: 32,
    marginLeft: "auto",
    borderRadius: 4,
    color: "#fff",
    marginRight: 16,
  },
  item: {
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 16,
  },
}));
