import React, { Fragment } from "react";
import {
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import PhoneInput from "react-phone-input-2";

const RenderEmailPhoneInfo = ({
  classes,
  countryCode,
  id,
  label,
  onEmailChange,
  onContactChange,
  emailValue,
  contactValue,
  disabledEmail
}) => (
  <Grid item container>
    <Grid item container direction="column" style={{ width: 335 }}>
      <label className={classes.label}>{label}</label>
      <TextField
        id={id}
        variant="outlined"
        className={classes.textField}
        placeholder="Email"
        InputProps={{
          className: classes.textFieldText,
        }}
        onChange={onEmailChange}
        value={emailValue}
        disabled={disabledEmail}
      />
    </Grid>

    <Grid
      item
      container
      direction="column"
      style={{ width: 335, marginLeft: 16 }}
    >
      <label className={classes.label}>Phone number</label>
      <PhoneInput
        country={"us"}
        // onlyCountries={['us', 'fr', 'it']}
        inputStyle={{ width: "100%", height: "56px" }}
        value={contactValue}
        onChange={(value) => onContactChange("+" + value)}
      />
    </Grid>
  </Grid>
);

export const RenderContactInfo = ({
  classes,
  countryCode,
  handleInputChange,
  member,
  disabledEmail
}) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Contact
    </Typography>
    <Divider light />
    <RenderEmailPhoneInfo
      classes={classes}
      countryCode={countryCode}
      label="Email"
      id="email1"
      onEmailChange={({ target }) => handleInputChange("email", target.value)}
      emailValue={member.email}
      onContactChange={(value) => handleInputChange("phone_number", value)}
      contactValue={member.phone_number}
      disabledEmail={disabledEmail}
    />
    {/* <RenderEmailPhoneInfo
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
      /> */}
  </Fragment>
);
