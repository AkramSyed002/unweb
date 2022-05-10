import React, { useState, Fragment, useEffect } from "react";
import { CSVLink } from "react-csv";
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
  getMemberById,
  hardDeleteMember,
  sendNotificationToAllUsers,
  updateFirestoreDocument,
  updateMemberByID,
} from "../../../firebase/services";
import { CollectionNames, USER_ROLES } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import LoadingModal from "../modals/LoadingModal";
import moment from "moment";

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
    value={status}
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
      VIP member <img src={crown} alt="crown" />
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
  const [isVipMember, setVipMember] = useState(null);
  const { members, setMembers } = useAppContext();
  const { currentUser } = useAuth();

  const [status, setStatus] = useState(null);
  const [deleteMemberModal, setDeleteMemberModal] = useState(false);
  const [tempStatusValue, setTempStatusValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState(null);

  useEffect(() => {
    const getMember = async () => {
      const memberDoc = await getMemberById(location.state.user.id);
      setMember({
        id: location.state.user.id,
        ...memberDoc.data(),
        phone_number:
          memberDoc.data().country_code + memberDoc.data().phone_number,
      });
      setStatus(memberDoc.data().status);
      setVipMember(memberDoc.data().isVipMember || false);
    };
    getMember();
  }, []);

  //Export user data
  let data = [];
  data.push({
    ...member,
    created_at:
      member?.created_at &&
      moment(new Date(member?.created_at?.seconds * 1000)).format(
        "DD MMM YYYY"
      ),
    date_of_birth:
      member?.date_of_birth &&
      moment(new Date(member?.date_of_birth?.seconds * 1000)).format(
        "DD MMM YYYY"
      ),
    membership_end_date:
      member?.membership_end_date &&
      moment(new Date(member?.membership_end_date?.seconds * 1000)).format(
        "DD MMM YYYY"
      ),
    membership_start_date:
      member?.membership_start_date &&
      moment(new Date(member?.membership_start_date?.seconds * 1000)).format(
        "DD MMM YYYY"
      ),
    membership_paid_date:
      member?.membership_paid_date &&
      moment(new Date(member?.membership_paid_date?.seconds * 1000)).format(
        "DD MMM YYYY"
      ),
    isVipMember: member?.isVipMember ? "Yes" : "No",
  });
  const csvReport = {
    filename: "UserData.csv",
    data,
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const onConfirmStatusChange = async () => {
    try {
      setLoading(true);
      let temp = [...members];
      let index = temp.findIndex((el) => el.id === member.id);
      temp[index].status = tempStatusValue;
      await updateFirestoreDocument(CollectionNames.USERS, temp[index]);
      setStatus(tempStatusValue);
      setMembers(temp);
      if (tempStatusValue === "cancelled") {
        sendNotificationToAllUsers(
          "member",
          `has cancelled ${member.first_name} ${member.last_name} profile`,
          member.id
        );
      }
      setTempStatusValue(null);
      setLoading(false);
      history.push(ROUTES.MEMBER_MANAGE);
    } catch (error) {
      console.log("Error updating member status", error.message);
    }
  };

  const handleStatusChange = async ({ target }) => {
    setTempStatusValue(target.value);
  };

  const handleVipStatus = async ({ target: { checked } }) => {
    try {
      let temp = [...members];
      let index = temp.findIndex((el) => el.id === member.id);
      temp[index].isVipMember = checked;
      temp[index].status = status;
      await updateFirestoreDocument(CollectionNames.USERS, temp[index]);
      setVipMember(checked);
      setMembers(temp);
    } catch (error) {
      console.log("Error updating vip status", error.message);
    }
  };

  const handleDeleteMemberModalOpen = () => {
    setDeleteMemberModal(true);
  };

  const handleEditMember = () => {
    history.push(ROUTES.MEMBER_VIEW, { member: member });
  };

  const onConfirmDelete = async () => {
    setLoading(true);
    await hardDeleteMember(member.id);
    sendNotificationToAllUsers(
      "member_profile_delete",
      `has been deleted ${member.first_name} ${member.last_name} profile`
    );
    const index = members.findIndex((el) => el.id === member.id);
    let temp = [...members];
    temp.splice(index, 1);
    setMembers(temp);
    setDeleteMemberModal(false);
    setLoading(false);
    history.push("/dashboard/manage-members");
  };

  const exportProfileCSV = () => {};

  if (currentUser === null || loading || member === null)
    return <LoadingModal modalVisible={true} />;

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
              style={{ textTransform: "none" }}
              label="Booking history"
              classes={{
                root: value === 1 ? classes.selectedTab : classes.tab,
              }}
              {...a11yProps(1)}
            />
          )}
          {currentUser.role !== USER_ROLES.GENERAL_MANAGER && (
            <Tab
              style={{ textTransform: "none" }}
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
              {/* {currentUser.role !== USER_ROLES.GENERAL_MANAGER &&
                currentUser.role !== USER_ROLES.AGENT && ( */}
              {currentUser.role === USER_ROLES.ADMIN && (
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
        <ProfileTab member={member} exportProfileCSV={exportProfileCSV} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <BookingHistoryTab memberId={member.id} />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ActivityLogTab member={member} />
      </TabPanel>
      {currentUser.role === USER_ROLES.ADMIN && (
        <CSVLink {...csvReport} className={classes.importCSVButton}>
          <Button
            disableElevation
            variant="text"
            className={classes.importCSVButton}
          >
            Export User Data
          </Button>
        </CSVLink>
      )}
      <AlertModal
        modalVisible={deleteMemberModal}
        handleClose={() => setDeleteMemberModal(false)}
        description="Are you sure you want to permanently delete this member?"
        onConfirmClick={onConfirmDelete}
      />
      <AlertModal
        modalVisible={tempStatusValue ? true : false}
        handleClose={() => setTempStatusValue(null)}
        description="Are you sure you want to change this member status?"
        onConfirmClick={onConfirmStatusChange}
        btnText="Yes"
        informative
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
  importCSVButton: {
    marginLeft: "auto",
    color: "#C0C0C0",
    height: 32,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 700,
    marginRight: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    lineHeight: "130%",
  },
}));
