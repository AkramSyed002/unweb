import { Divider, Grid, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { CountryPickers } from "../../CountryPickers";
import { RenderTextField } from "./RenderTextField";

export const RenderAddressInfo = ({ classes, member, handleInputChange }) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Address
    </Typography>
    <Divider light />

    <label className={classes.label}>Country</label>

    <CountryPickers
      placeholder="Select country"
      value={member.country}
      onChange={(target) => handleInputChange("country", target.label)}
    />
    <RenderTextField
      classes={classes}
      label="Address"
      id="addressLine1"
      placeholder="Address line 1"
      onChange={({ target }) => handleInputChange("address_1", target.value)}
      value={member.address_1}
    />
    <RenderTextField
      classes={classes}
      id="addressLine2"
      placeholder="Address line 2"
      onChange={({ target }) => handleInputChange("address_2", target.value)}
      value={member.address_2}
    />

    <Grid item container>
      <RenderTextField
        classes={classes}
        style={{ width: 335 }}
        label="City"
        id="city"
        placeholder="City"
        onChange={({ target }) => handleInputChange("city", target.value)}
        value={member.city}
      />
      <RenderTextField
        classes={classes}
        style={{ width: 335, marginLeft: 16 }}
        label="State"
        id="state"
        placeholder="State"
        onChange={({ target }) => handleInputChange("state", target.value)}
        value={member.state}
      />
    </Grid>

    <RenderTextField
      classes={classes}
      label="Postal Code"
      id="postalCode"
      placeholder="Postal Code"
      onChange={({ target }) => handleInputChange("zip_code", target.value)}
      value={member.zip_code}
    />
  </Fragment>
);
