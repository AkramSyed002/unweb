import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  TextField,
  Switch,
  Chip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import { NotificationStatusInitial, USER_ROLES } from "../../constants";
import { updateUserNotificationStatusByID } from "../../firebase/services";
import { useAppContext } from "../../context/AppContext";
import LoadingModal from "../../components/members/modals/LoadingModal";
import ManageUsersModal from "./modals/ManageUsersModal";
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

export const UsersTab = () => {
  const classes = useStyles();
  // my work
  const [modalOpen, setModalOpen] = useState(false);
  //

  const [selectedMembers, setSelectedMembers] = useState(null);
  const { members, admins } = useAppContext();

  const [loading, setLoading] = useState(false);

  const handleMemberEmailChange = (members) => {
    console.log(members);
    if (members === null) {
      setSelectedMembers(null);
    } else {
      setSelectedMembers(members);
      setModalOpen(true);
    }
  };

  if (loading) return <LoadingModal modalVisible={true} />;
  return (
    <>
      <Grid container>
        <Grid
          item
          container
          direction="column"
          className={classes.infoContainer}
        >
          <Fragment>
            <Typography className={classes.credentialTitle}>
              Manage users
            </Typography>
            <Divider light className={classes.divider} />
            {/* Work */}
            <Grid item container>
              <Autocomplete
                id="email"
                options={admins.filter((admin) => admin.email)}
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.last_name} | ${option.email}`
                }
                limitTags={1}
                style={{ width: 300 }}
                onChange={(_, value) => handleMemberEmailChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="email"
                    label="Select user"
                    placeholder="Email"
                    variant="outlined"
                    className={classes.textField}
                    style={{ width: 335 }}
                    value={selectedMembers?.id}
                  />
                )}
              />
            </Grid>
          </Fragment>
        </Grid>
      </Grid>
      {selectedMembers && (
        <ManageUsersModal
          selectedMembers={selectedMembers}
          setLoading={setLoading}
          openModal={modalOpen}
          closeModal={() => {
            setModalOpen(false);
            setSelectedMembers(null);
          }}
        />
      )}
    </>
  );
};
