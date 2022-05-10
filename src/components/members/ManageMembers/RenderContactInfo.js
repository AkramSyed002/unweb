import React, { Fragment, useState } from "react";
import { Divider, Grid, TextField, Typography } from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import { validateEmail } from "../../../utils/utils";

const RenderEmailPhoneInfo = ({
  classes,
  countryCode,
  id,
  label,
  onEmailChange,
  onContactChange,
  emailValue,
  contactValue,
  disabledEmail,
}) => {
  const [emailError, setEmailError] = useState(false);
  return (
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
          onBlur={() => {
            if (!validateEmail(emailValue)) setEmailError(true);
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
        <label className={classes.label}>Phone number</label>
        <PhoneInput
          country={"us"}
          // onlyCountries={['us', 'fr', 'it']}
          inputStyle={{
            width: "100%",
            height: "56px",
            fontSize: 16,
            fontWeight: 700,
            color: "#000",
            fontFamily: "Avenir",
          }}
          value={contactValue}
          onChange={(value) => onContactChange("+" + value)}
        />
      </Grid>
    </Grid>
  );
};

export const RenderContactInfo = ({
  classes,
  countryCode,
  handleInputChange,
  member,
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
    />
  </Fragment>
);
