import React, { Fragment, useRef, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Chip,
  Select,
  Snackbar,
  Checkbox,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PhoneInput from "react-phone-input-2";
import { ROUTES } from "../../constants/routes";
import { RenderImage } from "../../components/RenderImage";
import {
  addNewAdmin,
  sendNotificationToManagementUsers,
  updateFirestoreDocument,
  uploadSingleImage,
} from "../../firebase/services";
import { useAppContext } from "../../context/AppContext";
import { CollectionNames, USER_ROLES, USER_ROLES_FLOW } from "../../constants";
import {
  generateRandomPassword,
  getRestaurantsInfoByIDs,
  validateEmail,
} from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import AlertModal from "../../components/members/modals/AlertModal";
import { RenderImageMemo } from "../../components/RenderImageMemo";
import LoadingModal from "../../components/members/modals/LoadingModal";
import _ from "lodash";
import LeavePageBlocker from "../../components/LeavePageBlocker";

const initialData = {
  photo_url: null,
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  otp: generateRandomPassword(6),
  location_access: [],
  role: "",
  status: "active",
  isPasswordChanged: false,
};

const RenderBasicInfo = ({
  classes,
  profileImage,
  profileImageRef,
  onRefSelect,
  onSelect,
  onChange,
  firstName,
  lastName,
  phoneNumber,
  email,
  otp,
  canEdit,
  isViewMode,
}) => (
  <Fragment>
    <Typography className={classes.subTitle}>Basic info</Typography>
    <Divider light />
    <Typography className={classes.label}>Profile image</Typography>

    <RenderImageMemo
      image={profileImage}
      onRefSelect={onRefSelect}
      imageRef={profileImageRef}
      onSelect={onSelect}
      index={0}
      disabled={!canEdit}
    />
    <RenderFirstLastName
      classes={classes}
      onChange={onChange}
      firstName={firstName}
      lastName={lastName}
      disabled={!canEdit}
    />
    <RenderEmailPhone
      classes={classes}
      phoneNumber={phoneNumber}
      email={email}
      onChange={onChange}
      disabled={!canEdit}
      isViewMode={isViewMode}
    />
    <RenderOTP classes={classes} otp={otp} onChange={onChange} />
  </Fragment>
);

const RenderFirstLastName = ({
  classes,
  onChange,
  firstName,
  lastName,
  disabled,
}) => (
  <Fragment>
    <Grid item container>
      <Grid item container direction="column" style={{ width: 335 }}>
        <Typography className={classes.label}>First name *</Typography>
        <TextField
          disabled={disabled}
          id="firstName"
          variant="outlined"
          className={classes.textField}
          placeholder="First Name"
          InputProps={{
            className: classes.textFieldText,
          }}
          value={firstName}
          onChange={({ target }) => onChange("first_name", target.value)}
        />
      </Grid>

      <Grid
        item
        container
        direction="column"
        style={{ width: 114, marginLeft: 16 }}
      >
        <Typography className={classes.label}>Last name *</Typography>
        <TextField
          id="lastName"
          variant="outlined"
          className={classes.textField}
          placeholder="Last Name"
          InputProps={{
            className: classes.textFieldText,
          }}
          value={lastName}
          disabled={disabled}
          onChange={({ target }) => onChange("last_name", target.value)}
        />
      </Grid>
    </Grid>
  </Fragment>
);

const RenderEmailPhone = ({
  classes,
  email,
  phoneNumber,
  onChange,
  disabled,
  isViewMode,
}) => {
  const [emailError, setEmailError] = useState(false);

  return (
    <Fragment>
      <Grid item container>
        <Grid item container direction="column" style={{ width: 335 }}>
          <Typography className={classes.label}>Email *</Typography>
          <TextField
            id="email"
            variant="outlined"
            className={classes.textField}
            placeholder="Email"
            InputProps={{
              className: classes.textFieldText,
            }}
            onChange={({ target }) => onChange("email", target.value)}
            value={email}
            disabled={isViewMode}
            onBlur={() => {
              if (!validateEmail(email)) setEmailError(true);
              else setEmailError(false);
            }}
          />
          {emailError && <span style={{ color: "red" }}>Invalid Email</span>}
        </Grid>

        <Grid
          item
          container
          direction="column"
          style={{ width: 335, marginLeft: 16 }}
        >
          <Typography className={classes.label}>Phone number</Typography>
          <PhoneInput
            country={"us"}
            // onlyCountries={['us', 'fr', 'it']}
            inputStyle={{ width: "100%", height: "56px" }}
            value={phoneNumber}
            onChange={(value) => onChange("phone_number", value)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const RenderOTP = ({ classes, otp }) => (
  <Fragment>
    <Grid item container direction="column" style={{ width: 335 }}>
      <Typography className={classes.label}>One time password</Typography>
      <TextField
        id="otp"
        variant="outlined"
        className={classes.textField}
        placeholder="One Time Password"
        value={otp}
        InputProps={{
          className: classes.textFieldText,
        }}
        value={otp}
        disabled
      />
    </Grid>
  </Fragment>
);

const RenderLocationAccess = ({
  classes,
  onLocationSelect,
  onChange,
  accessType,
  restaurants,
  location_access,
  canEdit,
  roleLevel,
  allLocations,
}) => {
  const [allAccess, setAllAccess] = useState(
    accessType === "Admin" ? true : false
  );
  return (
    <Fragment>
      <Grid item container direction="column" style={{ width: 114 }}>
        <Typography
          className={classes.label}
          style={{ marginBottom: 0, lineHeight: "0.9rem" }}
        >
          Location access *
        </Typography>
        {!allAccess ? (
          <Autocomplete
            disabled={accessType == "Admin" ? true : !canEdit}
            multiple
            id="tags"
            limitTags={2}
            value={location_access.map((location) =>
              allLocations.find((restaurant) => location == restaurant?.id)
            )}
            options={restaurants.map(({ id, name }) => ({ id, name }))}
            disableCloseOnSelect
            onChange={onLocationSelect}
            getOptionLabel={(option) => {
              return option?.name;
            }}
            getOptionSelected={(option, value) => {
              return option?.id == value?.id;
            }}
            renderOption={(option, { selected, ...rest }) => {
              if (accessType == "Admin") {
                selected = true;
              }
              return (
                <React.Fragment>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    // checked={location_access.find((location) => location == option?.id)}
                    checked={selected}
                  />
                  {/* {option?.name} */}
                  {option?.name}
                </React.Fragment>
              );
            }}
            style={{ width: 390 }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Location Access"
                  style={{ background: "#fff" }}
                  // InputProps={{ style: { fontFamily: 'Avenir' } }}
                />
              );
            }}
          />
        ) : (
          <TextField
            disabled
            variant="outlined"
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
            value={"All Locations"}
          />
        )}
      </Grid>
      <Grid item container direction="column" style={{ width: 114 }}>
        <Typography className={classes.label}>Access type *</Typography>
        {canEdit ? (
          <Select
            disabled={!canEdit}
            id="countryCode"
            displayEmpty
            variant="outlined"
            className={classes.textField}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            value={accessType}
            onChange={({ target }) => onChange("role", target.value)}
          >
            <MenuItem disabled value="">
              <span
                style={{
                  color: "#9E9E9E",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Access Type
              </span>
            </MenuItem>
            {roleLevel === 4 && (
              <MenuItem
                value="Admin"
                onClick={(e) => {
                  let tempRestaurants = restaurants.map(({ id }) => id);
                  onChange("location_access", tempRestaurants);
                  setAllAccess(true);
                  // onLocationSelect("", tempRestaurants);
                }}
              >
                Admin
              </MenuItem>
            )}
            {roleLevel > 3 && (
              <MenuItem
                value="Reservations Manager"
                onClick={() => {
                  if (allAccess) onChange("location_access", []);
                  setAllAccess(false);
                }}
              >
                Reservations Manager
              </MenuItem>
            )}
            {roleLevel > 2 && (
              <MenuItem
                value="Reservations Supervisor"
                onClick={() => {
                  if (allAccess) onChange("location_access", []);
                  setAllAccess(false);
                }}
              >
                Reservations Supervisor
              </MenuItem>
            )}
            {roleLevel > 1 && (
              <MenuItem
                value="Agent"
                onClick={() => {
                  if (allAccess) onChange("location_access", []);
                  setAllAccess(false);
                }}
              >
                Agent
              </MenuItem>
            )}
            {roleLevel >= 0 && (
              <MenuItem
                value="General Manager"
                onClick={() => {
                  if (allAccess) onChange("location_access", []);
                  setAllAccess(false);
                }}
              >
                Guest Manager
              </MenuItem>
            )}
          </Select>
        ) : (
          <TextField
            disabled
            variant="outlined"
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
            value={accessType}
          />
        )}
      </Grid>
    </Fragment>
  );
};

const RenderHero = ({
  classes,
  onSaveClick,
  onChange,
  loading,
  isViewMode,
  canEdit,
  adminData,
  setCancelConfirmModal,
  setUpdateConfirmModal,
}) => {
  const getBGColor = (state) => {
    if (state === "active") return "#70C78D";
    else if (state === "suspended") return "#CF9F2B";
    else return "#FF0000";
  };
  return (
    <Fragment>
      <Typography className={classes.title}>
        {isViewMode ? "Edit" : "New"} user
      </Typography>
      <Grid item container justify="flex-end" alignItems="center">
        <Select
          style={{
            color: "#fff",
            backgroundColor: getBGColor(adminData.status),
          }}
          disabled={!canEdit}
          id="status"
          variant="outlined"
          className={classes.activeStatus}
          margin="dense"
          value={adminData.status}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          onChange={({ target }) => onChange("status", target.value)}
        >
          <MenuItem value="active" style={{ color: "#70C78D" }}>
            Active
          </MenuItem>
          <MenuItem value="suspended" style={{ color: "#CF9F2B" }}>
            Suspended
          </MenuItem>
          <MenuItem value="inActive" style={{ color: "#FF0000" }}>
            In-Active
          </MenuItem>
        </Select>
        <Button
          disabled={loading}
          variant="text"
          className={classes.cancelButton}
          onClick={() => setCancelConfirmModal(true)}
        >
          Cancel
        </Button>
        {canEdit && (
          <Button
            disabled={(() => {
              if (
                adminData.first_name == "" ||
                adminData.last_name == "" ||
                !validateEmail(adminData.email) ||
                adminData.otp == "" ||
                adminData.location_access.length == 0 ||
                adminData.role == "" ||
                loading
              ) {
                return true;
              } else {
                return false;
              }
            })()}
            onClick={
              isViewMode ? () => setUpdateConfirmModal(true) : onSaveClick
            }
            variant="contained"
            className={classes.saveButton}
          >
            {isViewMode ? "Update" : "Save"}
          </Button>
        )}
      </Grid>
    </Fragment>
  );
};

const ManageAdmin = () => {
  const { currentUser } = useAuth();
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const profileImageRef = useRef();
  const [updateConfirmModal, setUpdateConfirmModal] = useState(false);
  const [cancelConfirmModal, setCancelConfirmModal] = useState(false);
  const isViewMode = location.state ? true : false;

  const { admins, setAdmins, restaurants } = useAppContext();
  const [canEdit, setCanEdit] = useState(true);
  const [roleLevel, setRoleLevel] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [admin, setAdmin] = useState(
    isViewMode
      ? Object.assign({}, location.state.admin)
      : Object.assign({}, initialData)
  );

  const [snackbarAlertText, setSnackbarAlertText] = useState(
    "Admin successfully added!"
  );

  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    let tempAdmin = Object.assign(admin);
    let tempInitial = Object.assign(initialData);

    // delete tempAdmin.otp;
    // delete tempInitial.otp;

    if (location.state && _.isEqual(admin, location.state.admin)) {
      setDirty(false);
    } else if (_.isEqual(tempAdmin, tempInitial)) {
      setDirty(false);
    } else setDirty(true);
  }, [admin]);

  const checkIfCanEdit = () => {
    const currentAdminIndex = USER_ROLES_FLOW.map((e) => e.role).indexOf(
      currentUser.role
    );
    setRoleLevel(currentAdminIndex);
    if (currentUser.role === USER_ROLES.ADMIN) return setCanEdit(true);
    if (!isViewMode) return;
    const selectedAdminLocations = location.state.admin.location_access.map(
      (el) => el.id
    );
    let matchRestaurants =
      currentUser.location_access.filter((o1) =>
        selectedAdminLocations.some((o2) => o1 === o2)
      ).length > 0;
    // 1st check if both have locations matches
    if (matchRestaurants) {
      // 2nd check if lower staff from current

      const otherAdminIndex = USER_ROLES_FLOW.map((e) => e.role).indexOf(
        location.state.admin.role
      );
      if (currentAdminIndex >= otherAdminIndex) {
        setCanEdit(true);
      } else setCanEdit(false);
    } else {
      setCanEdit(false);
    }
  };

  const onRefSelect = () => {
    profileImageRef.current.click();
  };

  useEffect(() => {
    if (location?.state?.admin && currentUser) {
      const locations = location.state.admin.location_access.map(
        (location) => location.id
      );
      setAdmin({ ...location.state.admin, location_access: locations });
    }
  }, [location.state, currentUser]);

  useEffect(() => {
    if (currentUser) {
      checkIfCanEdit();
    }
  }, [currentUser]);

  const handleInputChange = (name, value) => {
    setAdmin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onImageSelect = (file) => {
    admin.photo_url = file;
    handleInputChange("photo_url", admin.photo_url);
  };

  const handleAccessLocationChange = (_, value) => {
    handleInputChange(
      "location_access",
      value.map((option) => option.id || option)
    );
  };

  const handleChipDelete = (index) => {
    admin.location_access.splice(index, 1);
    handleInputChange("location_access", admin.location_access);
  };

  const onSave = async () => {
    setLoading(true);
    setDirty(false);
    try {
      if (admin.photo_url) {
        const downloadImageUrl = await uploadSingleImage(admin.photo_url);
        admin.photo_url = downloadImageUrl;
      }
      admin.fcmToken = null;
      const response = await addNewAdmin(admin);
      admin.id = response.data.userId;

      sendNotificationToManagementUsers(
        "user",
        `has created ${admin.first_name} ${admin.last_name} as ${admin.role}`,
        admin.id
      );
      setSnackbarAlertText("Admin Successfully Added!");
      setSnackbarVisible(true);
      setLoading(false);
      const temp = [...admins];
      let copyAdmin = Object.assign({}, admin);

      copyAdmin.location_access = getRestaurantsInfoByIDs(
        restaurants,
        admin.location_access
      );
      temp.push(copyAdmin);
      setAdmins(temp);
      confirmCancel();
    } catch (error) {
      setLoading(false);

      if (error.message === "not-found")
        return alert("Email has already been registered");
      console.log("Error adding admin", error);
    }
  };

  const onUpdate = async () => {
    try {
      setUpdateConfirmModal(false);
      setLoading(true);
      if (admin.photo_url && typeof admin.photo_url === "object") {
        const downloadImageUrl = await uploadSingleImage(admin.photo_url);
        admin.photo_url = downloadImageUrl;
      }

      await updateFirestoreDocument(CollectionNames.ADMIN, admin);
      setSnackbarAlertText("Admin Successfully Updated!");
      setSnackbarVisible(true);

      const temp = [...admins];
      let index = temp.findIndex((el) => el.id === admin.id);
      let newAdmin = Object.assign({}, admin);
      newAdmin.location_access = getRestaurantsInfoByIDs(
        restaurants,
        admin.location_access
      );
      temp[index] = newAdmin;
      setAdmins(temp);
      setLoading(false);
      // confirmCancel();
    } catch (error) {
      console.log("Error adding restaurant", error);
    }
  };

  const confirmCancel = async () => {
    let temp = Object.assign({}, admin);
    temp.photo_url = null;
    setAdmin(temp);

    setCancelConfirmModal(false);
    setUpdateConfirmModal(false);
    history.replace({
      pathname: "/dashboard/admins",
      state: { user: admins },
    });
  };

  if (currentUser === null) return <LoadingModal modalVisible={true} />;

  return (
    <Grid container className={classes.mainContainer}>
      <LeavePageBlocker when={dirty} />
      {loading && <LoadingModal modalVisible={true} />}
      <Snackbar
        open={snackbarVisible}
        autoHideDuration={6000}
        onClose={() => setSnackbarVisible(false)}
      >
        <MuiAlert onClose={() => setSnackbarVisible(false)} severity="success">
          {snackbarAlertText}
        </MuiAlert>
      </Snackbar>
      <RenderHero
        classes={classes}
        history={history}
        onChange={handleInputChange}
        status={admin.status}
        onSaveClick={onSave}
        onUpdateClick={onUpdate}
        loading={loading}
        isViewMode={isViewMode}
        canEdit={canEdit}
        adminData={admin}
        setCancelConfirmModal={setCancelConfirmModal}
        setUpdateConfirmModal={setUpdateConfirmModal}
      />
      <Grid item container direction="column" className={classes.infoContainer}>
        <RenderBasicInfo
          classes={classes}
          onRefSelect={onRefSelect}
          onSelect={onImageSelect}
          profileImage={admin.photo_url}
          profileImageRef={profileImageRef}
          onChange={handleInputChange}
          firstName={admin.first_name}
          lastName={admin.last_name}
          phoneNumber={admin.phone_number}
          email={admin.email}
          otp={admin.otp}
          canEdit={canEdit}
          isViewMode={isViewMode}
        />
        <RenderLocationAccess
          classes={classes}
          accessType={admin.role}
          handleChipDelete={handleChipDelete}
          onLocationSelect={handleAccessLocationChange}
          onChange={handleInputChange} // if admin show all  // if not show current admin has access to
          restaurants={
            currentUser.role === USER_ROLES.ADMIN
              ? restaurants
              : restaurants.filter((el) =>
                  currentUser.location_access.includes(el.id)
                )
          }
          allLocations={restaurants}
          location_access={admin.location_access}
          canEdit={canEdit}
          roleLevel={roleLevel}
        />
      </Grid>
      <AlertModal
        description={"Are you sure you want to update this record"}
        informative
        onConfirmClick={onUpdate}
        handleClose={() => setUpdateConfirmModal(false)}
        modalVisible={updateConfirmModal}
        btnText="Yes, update it"
      />
      <AlertModal
        description={
          "Are you sure you want to cancel? All changes will be lost"
        }
        onConfirmClick={confirmCancel}
        handleClose={() => setCancelConfirmModal(false)}
        modalVisible={cancelConfirmModal}
        btnText="Yes"
        btn2Text="No"
      />
    </Grid>
  );
};

export default ManageAdmin;
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  title: {
    marginTop: 110,
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
  },
  saveButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    borderRadius: 4,
    textTransform: "none",
  },
  cancelButton: {
    color: "#C0C0C0",
    fontWeight: 600,
    fontSize: 16,
    textTransform: "none",
    paddingRight: 16,
    // height:
  },
  infoContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    padding: 40,
    marginBottom: 48,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: "#353535",
    marginBottom: 16,
  },
  textField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 700,
    color: "#000",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: "#727272",
    color: "#000",
    fontFamily: "Avenir",
  },
  label: {
    marginTop: 10,
    padding: "10px 0 10px 0",
    color: "#C0C0C0",
    fontSize: 15,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  imageContainer: {
    width: 200,
    height: 200,
    border: "#C0C0C0 dashed 2px",
    borderRadius: 8,
    marginRight: 8,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
  activeStatus: {
    width: 229,
    height: 32,
    marginRight: 24,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 12,
    background: "#70C78D",
    color: "#fff",
  },
}));
