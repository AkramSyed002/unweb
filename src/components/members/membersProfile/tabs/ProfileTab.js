import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  Chip,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

import profile from "../../../../assets/images/memberProfileImage.png";
import crown from "../../../../assets/icons/crown.png";
import { getMemberAccessCode } from "../../../../firebase/services";
import { PinCodeBoxes } from "../../../PinCodeBoxes";
import moment from "moment";
import { convertToDateString } from "../../../../utils/utils";
import { useAuth } from "../../../../context/AuthContext";
import { USER_ROLES } from "../../../../constants";

const RenderBasicInfo = ({ classes, member }) => (
  <Grid
    item
    container
    direction="column"
    className={classes.infoContainer}
    style={{ height: 630 }}
  >
    <Typography className={classes.subTitle}>Basic info</Typography>
    <Divider light />
    <MemberDetails classes={classes} member={member} />
    <label className={classes.label}>Profile notes</label>
    <Typography className={classes.noteTitle}>
      {member.profile_notes}
    </Typography>
  </Grid>
);

const MemberDetails = ({ classes, member }) => (
  <Grid item container direction="column" alignItems="center">
    <Avatar
      src={member.profile_image_URL ? member.profile_image_URL : profile}
      className={classes.avatar}
    />
    {member?.isVipMember && (
      <Typography
        style={{
          color: "#727272",
          fontFamily: "Avenir",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: 16,
        }}
      >
        VIP member <img src={crown} alt="crown" />
      </Typography>
    )}
    <Typography className={classes.title}>
      {member.first_name + " " + member.last_name}
    </Typography>
    <Typography className={classes.emailPhoneTitle}>
      {member.email}
      <br /> {member.phone_number}
    </Typography>
    <Typography style={{ color: "#C0C0C0", marginBottom: 20 }}></Typography>
    <Grid item container justify="center" style={{ marginBottom: 30 }}>
      {member.tags &&
        member.tags.map((tag, index) => (
          <Chip
            label={tag}
            key={index}
            className={classes.chip}
            variant="outlined"
            color={"secondary"}
            style={{ marginTop: 5 }}
          />
          //onDelete has (cross) icon and  take function
        ))}
    </Grid>
  </Grid>
);

const RenderRestaurantDetails = ({ classes, member }) => {
  return (
    <Grid
      item
      container
      direction="column"
      className={classes.infoContainer}
      style={{ height: 430 }}
    >
      <label className={classes.label}>Home restaurant</label>
      <Typography className={classes.noteTitle}>
        {member.home_restaurant}
        {/* <a style={{ fontSize: 16, fontWeight: 400, color: "#C0C0C0" }}>
        14 visits
      </a> */}
      </Typography>

      <label className={classes.label}>Secondary restaurants</label>

      {member.global_locations &&
        member.global_locations.map((el, i) => (
          <Typography key={i.toString()} className={classes.noteTitle}>
            {el}{" "}
            {/* <a style={{ fontSize: 16, fontWeight: 400, color: "#C0C0C0" }}>
            12 visits
          </a> */}
          </Typography>
        ))}

      <label className={classes.label}>Birthday</label>
      <Typography className={classes.noteTitle}>
        {moment(convertToDateString(member.date_of_birth)).format(
          "DD MMMM YYYY"
        )}
      </Typography>

      <label className={classes.label}>Address</label>
      <Typography className={classes.noteTitle}>
        {member.address_1} {member.address_2}
        <br />
        {member.city} {member.state} {member.zip_code}
      </Typography>
    </Grid>
  );
};

const RenderMemberShipDetails = ({ classes, onPinChange, pinCode, member }) => (
  <Grid
    item
    container
    direction="column"
    className={classes.infoContainer}
    style={{ height: 830 }}
  >
    <Typography className={classes.subTitle}>Membership details</Typography>
    <Divider light />
    {/*   <Typography style={{ fontWeight: 500, fontSize: 16, marginTop: 56 }}>
      This will be used to create a new account.
    </Typography>
    <PinCodeBoxes pinCode={pinCode} width="50%" />
    <Typography
      color="primary"
      style={{ marginLeft: "12.3em", cursor: "pointer" }}
    >
      Generate new pin
    </Typography> */}
    <Grid item container direction="column" style={{ width: 114 }}>
      <label className={classes.label} style={{ marginBottom: -20 }}>
        Zuma main contact name
      </label>
      <TextField
        id="contactName"
        variant="outlined"
        placeholder="Name"
        className={classes.textField}
        InputProps={{
          className: classes.textFieldText,
        }}
        // disabled={true}
        value={`${member.first_name} ${member.last_name}`}
      />
      <label className={classes.label}>Email</label>
      <TextField
        id="email"
        variant="outlined"
        placeholder="Email"
        className={classes.textField}
        InputProps={{
          className: classes.textFieldText,
        }}
        // disabled={true}
        value={member.email}
      />

      <label className={classes.label}>Phone number</label>
      <Grid item container style={{ width: 400 }}>
        <PhoneInput
          country={"us"}
          inputStyle={{
            width: "100%",
            height: "56px",
            fontSize: 16,
            fontWeight: 700,
            // color: '#C0C0C0',
            color: "#000",
            fontFamily: "Avenir",
          }}
          value={member.phone_number}
          // onChange={(value) => onContactChange('+' + value)}
        />
      </Grid>
    </Grid>
    <label className={classes.label}>Creation date</label>
    <Typography className={classes.noteTitle}>
      {member?.created_at &&
        moment(new Date(member?.created_at?.seconds * 1000)).format(
          "DD MMM YYYY"
        )}
    </Typography>
    <label className={classes.label} style={{ marginTop: 40 }}>
      Membership paid date
    </label>
    <Typography className={classes.noteTitle}>
      {member?.membership_paid_date &&
        moment(new Date(member?.membership_paid_date?.seconds * 1000)).format(
          "DD MMM YYYY"
        )}
    </Typography>
    <label className={classes.label}>Membership start date</label>
    <Typography className={classes.noteTitle}>
      {member?.membership_start_date &&
        moment(new Date(member?.membership_start_date?.seconds * 1000)).format(
          "DD MMM YYYY"
        )}
    </Typography>
    <label className={classes.label}>Membership end date</label>
    <Typography className={classes.noteTitle}>
      {member?.membership_end_date &&
        moment(new Date(member?.membership_end_date?.seconds * 1000)).format(
          "DD MMM YYYY"
        )}
    </Typography>
  </Grid>
);

const ProfileTab = ({ member }) => {
  const classes = useStyles();
  const location = useLocation();

  const [pinCode, setPinCode] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const getAccessCode = async () => {
      let id = "";
      const snap = await getMemberAccessCode(member.id);
      snap.forEach((doc) => {
        id = doc.id;
      });
      setPinCode(id);
    };

    getAccessCode();
  }, []);

  const onPinChange = (value) => {
    setPinCode(value);
  };

  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid
          item
          container
          xl
          lg
          md
          sm
          xs
          style={{ background: "white", paddingRight: 8 }}
        >
          <RenderBasicInfo classes={classes} member={member} />
          {currentUser.role !== USER_ROLES.GENERAL_MANAGER && (
            <RenderRestaurantDetails classes={classes} member={member} />
          )}
        </Grid>
        {currentUser.role !== USER_ROLES.GENERAL_MANAGER && (
          <Grid
            item
            container
            xl
            lg
            md
            sm
            xs
            style={{ background: "white", paddingLeft: 8 }}
          >
            <RenderMemberShipDetails
              member={member}
              classes={classes}
              onPinChange={onPinChange}
              pinCode={pinCode}
            />
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
};

export default ProfileTab;
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  headerTitle: {
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
  },
  cancelButton: {
    color: "#C0C0C0",
    fontWeight: 600,
    fontSize: 16,
    textTransform: "none",
    paddingRight: 16,
  },
  infoContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    marginBottom: 16,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#353535",
    marginBottom: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#353535",
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: "#727272",
    marginBottom: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  emailPhoneTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: "#727272",
    textAlign: "center",
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  textField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
    marginTop: 0,
    fontFamily: "Avenir",
    fontStyle: "normal",
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
    marginTop: 16,
    color: "#C0C0C0",
    // color: "#000",
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 13,
  },
  dayLabel: {
    marginTop: 16,
    color: "#353535",
    marginBottom: 4,
    fontWeight: 500,
    fontSize: 16,
    width: 52,
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
    color: "#000",
  },
  addMealSlotButton: {
    width: 176,
    height: 52,
    background: "#5EA0E0",
    color: "#fff",
    textTransform: "none",
    fontWeight: 700,
    fontSize: 16,
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
    marginRight: 4,
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
    marginBottom: 8,
  },
  deleteButton: {
    color: "#5EA0E0",
    marginLeft: "auto",
    textTransform: "none",
    fontWeight: 500,
    fontSize: 16,
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
    marginTop: 56,
    marginBottom: 13,
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
  },
  exportCSVButton: {
    color: "#C0C0C0",
    height: 32,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 30,
    // fontFamily: "Avenir",
    // fontStyle: "normal",
  },
}));
