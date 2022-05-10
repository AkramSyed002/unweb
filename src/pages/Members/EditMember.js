import React, { Fragment, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Checkbox,
  Avatar,
  Chip,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import PinInput from "react-pin-input";

import CheckIcon from "@material-ui/icons/Check";

import profile from "../../assets/images/memberProfileImage.png";
import DeleteTagModal from "../../components/members/membersProfile/modals/DeleteTagModal";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  headerTitle: {
    marginTop: 110,
    color: "#353535",
    fontSize: 30,
    fontWeight: 700, fontFamily: 'Avenir'
  },
  saveButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    borderRadius: 4,
    fontFamily: 'Avenir',
    fontWeight: 600
  },
  cancelButton: {
    color: "#C0C0C0",
    fontWeight: 600,
    fontSize: 16,
    textTransform: "none",
    paddingRight: 16, fontFamily: 'Avenir'
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
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#353535",
    marginBottom: 26, fontFamily: 'Avenir'
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: "#353535",
    marginBottom: 16, fontFamily: 'Avenir'
  },
  textField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
    color: '#000', fontFamily: 'Avenir'
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700, fontFamily: 'Avenir'
    // color: "#727272",
    // color: "#000",
  },
  label: {
    marginTop: 16,
    // color: "#C0C0C0",
    color: "#000",
    marginBottom: 4,
  },
  dayLabel: {
    marginTop: 16,
    color: "#353535",
    marginBottom: 4,
    fontWeight: 500,
    fontSize: 16,
    width: 52, fontFamily: 'Avenir'
  },
  dottedButton: {
    width: 176,
    height: 55,
    border: "#C0C0C0 dashed 2px",
    marginLeft: 25,
    marginTop: 8,
    color: "#C0C0C0",
    textTransform: "none",
  },
  dinnerButton: {
    width: 176,
    height: 55,
    marginLeft: 25,
    marginTop: 8,
    textTransform: "none",
    background: "#fff",
    border: "#E4E4E4 solid 1px",
    color: "#727272",
  },
  dinnerTextField: {
    width: 176,
    height: 55,
    marginTop: 8,
    textTransform: "none",
    background: "#fff",
    // color: "#727272",
    // color: "#000",
  },
  addMealSlotButton: {
    width: 176,
    height: 52,
    background: "#5EA0E0",
    color: "#fff",
    textTransform: "none",
    fontWeight: 700,
    fontSize: 16, fontFamily: 'Avenir'
  },
  blueTickIcon: {
    marginLeft: "3.5em",
    color: "#fff",
    background: "#5EA0E0",
    borderRadius: 4,
  },
  timeTextFiled: {
    width: 107,
    marginTop: 8,
    background: "#fff",
    marginLeft: 9,
  },
  locationStatusSelect: {
    width: 229,
    height: 32,
    marginLeft: 16,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 12,
    color: "#fff",
  },
  countryCodeSelect: {
    width: 110,
    borderRadius: 8,
    marginBottom: 9,
    background: "#fff",
  },
  socialLinkSelect: {
    width: 135,
    borderRadius: 8,
    marginBottom: 9,
    background: "#fff",
  },
  imageContainer: {
    width: 200,
    height: 200,
    border: "#C0C0C0 dashed 2px",
    borderRadius: 8,
    marginRight: 8,
  },
  listItem: {
    color: "#727272",
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 8, fontFamily: 'Avenir'
  },
  deleteButton: {
    color: "#5EA0E0",
    marginLeft: "auto",
    textTransform: "none",
    fontWeight: 500,
    fontSize: 16, fontFamily: 'Avenir'
  },
  saveButtonBottom: {
    color: "#fff",
    background: "#5EA0E0",
    width: 335,
    height: 55,
    borderRadius: 4,
    marginBottom: 100,
  },
  avatar: {
    width: 150,
    height: 150,
    marginTop: 16,
    marginBottom: 13,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
  sendEmail: {
    fontWeight: 700,
    fontSize: 13,
    marginLeft: "auto",
    cursor: "pointer",
    color: "#5EA0E0", fontFamily: 'Avenir'
  },
  emailSentText: {
    color: "#70C78D",
    fontWeight: 500,
    fontSize: 13,
    width: "90%", fontFamily: 'Avenir'
  },
}));

const RenderActivationPin = ({ classes, onPinChange, pinValue }) => (
  <Fragment>
    <Typography className={classes.title}>Afolabi David’s Profile</Typography>
    <Typography className={classes.subTitle}>Account Activation Pin</Typography>
    <Divider light />
    <Typography style={{ fontWeight: 500, fontSize: 16 }}>
      This will be used to create a new account.
    </Typography>
    <PinInput
      length={5}
      focus
      initialValue={pinValue}
      style={{ marginTop: 16 }}
      inputStyle={{
        borderColor: "#C0C0C0",
        fontSize: 28,
        fontWeight: 700,
        height: 70,
        width: 50,
        backgroundColor: "#fff",
        marginRight: 14,
      }}
      inputFocusStyle={{ borderColor: "#C0C0C0" }}
      type="numeric"
      onChange={onPinChange}
    />
    <Typography color="primary" style={{ marginLeft: "12.3em" }}>
      Generate new pin
    </Typography>
  </Fragment>
);

const RenderBasicInfo = ({ classes, chipData, handleChipDelete }) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Basic Info
    </Typography>
    <Divider light />
    <label className={classes.label}>Profile Image</label>
    <Avatar src={profile} className={classes.avatar} />

    <Grid item container>
      <RenderTextField
        classes={classes}
        style={{ width: 335 }}
        label="Title"
        id="title"
        placeholder="Title"
      />
      <RenderTextField
        classes={classes}
        style={{ width: 335, marginLeft: 16 }}
        label="Preferred Greeting"
        id="preferredGreeting"
        placeholder="Preferred Greeting"
      />
    </Grid>

    <Grid item container>
      <RenderTextField
        classes={classes}
        style={{ width: 335 }}
        label="First Name"
        id="firstName"
        placeholder="First Name"
        value="Afolabi"
      />
      <RenderTextField
        classes={classes}
        style={{ width: 335, marginLeft: 16 }}
        label="Last Name"
        id="lastName"
        placeholder="Last Name"
        value="David"
      />
    </Grid>

    <label className={classes.label}>Profile Notes</label>
    <TextField
      id="title"
      fullWidth
      multiline
      rows={6}
      maxRows={6}
      variant="outlined"
      value="Allergic to peanuts, lactose"
      style={{ background: "#fff" }}
      InputProps={{
        className: classes.textFieldText,
      }}
    />
    <Grid item container>
      <RenderTextField
        classes={classes}
        label="Tags"
        id="tags"
        placeholder="Type Something"
        style={{ width: 335 }}
      />
      <Grid
        item
        container
        alignItems="flex-end"
        style={{ width: "65%", marginLeft: 16, marginBottom: 8 }}
      >
        {chipData.map((chip) => (
          <Chip
            label={chip.label}
            style={{
              color:
                chip.label === "Allergy"
                  ? "#5EA0E0"
                  : chip.label === "Intolerance"
                    ? "#1D244D"
                    : chip.label === "Wheelchair Access"
                      ? "#39903C"
                      : "#5EA0E0",
              background:
                chip.label === "Allergy"
                  ? "#EFF6FC"
                  : chip.label === "Intolerance"
                    ? "#FAEFFA"
                    : chip.label === "Wheelchair Access"
                      ? "#F1FCEF"
                      : "#EFF6FC",
            }}
            onDelete={
              chip.label === "React" ? undefined : handleChipDelete(chip)
            }
            className={classes.chip}
          />
        ))}
      </Grid>
    </Grid>
    <RenderTextField
      classes={classes}
      label="Home Location"
      id="homeLocation"
      placeholder="Type Something"
    />
    <RenderTextField
      classes={classes}
      label="Global Locations"
      id="globalLocation"
      placeholder="Type Something"
    />

    <label className={classes.label}>Birthday</label>
    <Grid item container>
      <TextField
        id="day"
        variant="outlined"
        placeholder="Day"
        className={classes.textField}
        style={{ width: 108, marginRight: 4 }}
        InputProps={{
          className: classes.textFieldText,
        }}
      />
      <TextField
        id="month"
        variant="outlined"
        placeholder="Month"
        className={classes.textField}
        style={{ width: 218, marginRight: 4 }}
        InputProps={{
          className: classes.textFieldText,
        }}
      />
      <TextField
        id="year"
        variant="outlined"
        placeholder="Year"
        className={classes.textField}
        style={{ width: 108 }}
        InputProps={{
          className: classes.textFieldText,
        }}
      />
    </Grid>
  </Fragment>
);

const RenderTextField = ({ classes, style, label, id, placeholder, value }) => (
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
    />
  </Grid>
);

const RenderContactInfo = ({
  classes,
  countryCode,
  sendEmail,
  setSendEmail,
}) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Contact
    </Typography>
    <Divider light />
    <RenderEmailPhoneInfo
      classes={classes}
      countryCode={countryCode}
      label="Email 1"
      id="email1"
      email="davida@gmail.com"
      phone="(217) 555-0113"
      sendEmail={sendEmail}
      setSendEmail={setSendEmail}
    />
    <RenderEmailPhoneInfo
      classes={classes}
      countryCode={countryCode}
      label="Email 2"
      id="email2"
    />
    <RenderEmailPhoneInfo
      classes={classes}
      countryCode={countryCode}
      label="Email 3"
      id="email3"
    />
  </Fragment>
);

const RenderEmailPhoneInfo = ({
  classes,
  countryCode,
  id,
  label,
  email,
  phone,
  sendEmail,
  setSendEmail,
}) => (
  <Grid item container>

    <Grid item container direction="column" style={{ width: 335 }}>
      <label className={classes.label}>{label}</label>
      <TextField
        id={id}
        variant="outlined"
        className={classes.textField}
        placeholder="Email"
        value={email}
        InputProps={{
          className: classes.textFieldText,
        }}
      />

      {sendEmail === "Send password reset email" ? (
        <Typography
          className={classes.sendEmail}
          onClick={() => setSendEmail("password reset email sent")}
        >
          {sendEmail}
        </Typography>
      ) : sendEmail === "password reset email sent" ? (
        <Grid item container>
          <CheckIcon
            style={{ marginBottom: -5, width: 30, color: "#70C78D" }}
          />
          <Typography className={classes.emailSentText}>
            A password reset email has been sent to zie@chopdawg.com
          </Typography>
        </Grid>
      ) : undefined}
    </Grid>

    <Grid
      item
      container
      direction="column"
      style={{ width: 114, marginLeft: 16 }}
    >
      <label className={classes.label}>Phone number</label>
      <TextField
        id="locationStatus"
        variant="outlined"
        value={countryCode}
        className={classes.countryCodeSelect}
        select
        InputProps={{
          className: classes.textFieldText,
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        <MenuItem value="usa">USA +1</MenuItem>
        <MenuItem value="france">France </MenuItem>
        <MenuItem value="italy">Italy</MenuItem>
      </TextField>
    </Grid>
    <TextField
      id="phone"
      variant="outlined"
      placeholder="(123) 456 7890"
      value={phone}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
      style={{ marginTop: 38, marginBottom: 9, height: 55 }}
    />
  </Grid>
);

const RenderAddressInfo = ({ classes }) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Address
    </Typography>
    <Divider light />
    <RenderTextField
      classes={classes}
      label="Country"
      id="country"
      placeholder="Country"
    />
    <RenderTextField
      classes={classes}
      label="Address"
      id="addressLine1"
      placeholder="Address Line 1"
    />
    <RenderTextField
      classes={classes}
      id="addressLine2"
      placeholder="Address Line 2"
    />

    <Grid item container>
      <RenderTextField
        classes={classes}
        style={{ width: 335 }}
        label="City"
        id="city"
        placeholder="City"
      />
      <RenderTextField
        classes={classes}
        style={{ width: 335, marginLeft: 16 }}
        label="State"
        id="state"
        placeholder="State"
      />
    </Grid>

    <RenderTextField
      classes={classes}
      label="Postal Code"
      id="postalCode"
      placeholder="Postal Code"
    />
  </Fragment>
);

const RenderMarketingPreferences = ({
  classes,
  checkboxState,
  handleCheckboxChange,
}) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Marketing Preferences
    </Typography>
    <Divider light />
    <FormGroup column>
      <RenderCheckBox
        name="emailCheckbox"
        label="Opt in via Email"
        checkboxState={checkboxState.emailCheckbox}
        handleCheckboxChange={handleCheckboxChange}
      />
      <RenderCheckBox
        name="smsCheckbox"
        label="Opt in via SMS Text Message"
        checkboxState={checkboxState.smsCheckbox}
        handleCheckboxChange={handleCheckboxChange}
      />
      <RenderCheckBox
        name="outOfAllCheckbox"
        label="Opt out of all promotional materials."
        checkboxState={checkboxState.outOfAllCheckbox}
        handleCheckboxChange={handleCheckboxChange}
      />
    </FormGroup>
  </Fragment>
);

const RenderCheckBox = ({
  name,
  label,
  checkboxState,
  handleCheckboxChange,
}) => (
  <FormControlLabel
    control={
      <Checkbox
        onChange={handleCheckboxChange}
        checked={checkboxState}
        name={name}
        color="primary"
      />
    }
    label={label}
  />
);

const EditMember = () => {
  const classes = useStyles();
  const history = useHistory();

  const [pinValue, setPinValue] = useState(12345);
  const [countryCode, setCountryCode] = useState("usa");
  const [deleteTagModal, setDeleteTagModal] = useState(false);
  const [deleteTag, setDeleteTag] = useState(false);

  const [sendEmail, setSendEmail] = useState("Send password reset email");

  const [checkboxState, setCheckboxState] = useState({
    emailCheckbox: false,
    smsCheckbox: true,
    outOfAllCheckbox: false,
  });

  const handleDeleteTagModalOpen = () => {
    setDeleteTagModal(true);
  };

  const handleDeleteTagModalClose = () => {
    setDeleteTagModal(false);
    setDeleteTag(false);
  };

  const handleCheckboxChange = (event) => {
    setCheckboxState({
      ...checkboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const onPinChange = (value) => {
    setPinValue(value);
  };

  const [chipData, setChipData] = useState([
    { key: 0, label: "Allergy" },
    { key: 1, label: "Intolerance" },
    { key: 2, label: "Wheelchair Access" },
  ]);

  const handleChipDelete = (chipToDelete) => () => {
    handleDeleteTagModalOpen();
    // setChipData((chips) =>
    //   chips.filter((chip) => chip.key !== chipToDelete.key)
    // );
  };

  return (
    <Grid container className={classes.mainContainer}>
      <Typography className={classes.headerTitle}>Edit Member</Typography>
      <Grid item container justify="flex-end">
        <Button
          variant="text"
          className={classes.cancelButton}
          onClick={() => history.push("/dashboard/member-profile")}
        >
          Cancel
        </Button>
        <Button variant="contained" className={classes.saveButton}>
          Save
        </Button>
      </Grid>
      <Grid item container direction="column" className={classes.infoContainer}>
        <RenderActivationPin
          classes={classes}
          onPinChange={onPinChange}
          pinValue={pinValue}
        />
        <RenderBasicInfo
          classes={classes}
          chipData={chipData}
          handleChipDelete={handleChipDelete}
        />
        <RenderContactInfo
          classes={classes}
          countryCode={countryCode}
          sendEmail={sendEmail}
          setSendEmail={setSendEmail}
        />
        <RenderAddressInfo classes={classes} />
        <RenderMarketingPreferences
          classes={classes}
          checkboxState={checkboxState}
          handleCheckboxChange={handleCheckboxChange}
        />
      </Grid>
      <Grid item container justify="flex-end" alignItems="flex-start">
        <Button variant="contained" className={classes.saveButtonBottom}>
          Save
        </Button>
      </Grid>
      <DeleteTagModal
        deleteTagModal={deleteTagModal}
        handleDeleteTagModalClose={handleDeleteTagModalClose}
        setDeleteTag={setDeleteTag}
      // handleChipDelete={handleChipDelete}
      />
    </Grid>
  );
};

export default EditMember;
