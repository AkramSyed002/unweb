import React, { Fragment } from "react";
import { Grid, Typography, Divider, TextField } from "@material-ui/core";
import { CountryPickers } from "../../CountryPickers";

export const AddressInfo = ({ classes, handleInputChange, state, disableInput}) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Address
    </Typography>
    <Divider light />
    <label className={classes.label}>Country *</label>

    <CountryPickers
      disabled={disableInput}
      placeholder="Select country"
      value={state.country}
      onChange={(target) => handleInputChange("country", target.label)}
    />

    <label className={classes.label}>Address *</label>
    <TextField
      disabled={disableInput}
      id="addressLine1"
      variant="outlined"
      placeholder="Address line 1"
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
      value={state.address_line_1}
      onChange={({ target }) =>
        handleInputChange("address_line_1", target.value)
      }
    />
    <TextField
      disabled={disableInput}
      id="addressLine1"
      variant="outlined"
      placeholder="Address line 2"
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
      value={state.address_line_2}
      onChange={({ target }) =>
        handleInputChange("address_line_2", target.value)
      }
    />

    <Grid item container>
      <Grid item container direction="column" style={{ width: 335 }}>
        <label className={classes.label}>City *</label>
        <TextField
          disabled={disableInput}
          id="city"
          variant="outlined"
          placeholder="City"
          className={classes.textField}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={state.city}
          onChange={({ target }) => handleInputChange("city", target.value)}
        />
      </Grid>

      <Grid
        item
        container
        direction="column"
        style={{ width: 114, marginLeft: 16 }}
      >
        <label className={classes.label}>State *</label>
        <TextField
          disabled={disableInput}
          id="state"
          variant="outlined"
          placeholder="State"
          className={classes.textField}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={state.state}
          onChange={({ target }) => handleInputChange("state", target.value)}
        />
      </Grid>
    </Grid>
    <label className={classes.label}>Postal code</label>
    <TextField
      disabled={disableInput}
      id="postalCode"
      variant="outlined"
      placeholder="Postal code"
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
      value={state.postal_code}
      onChange={({ target }) => handleInputChange("postal_code", target.value)}
    />
    <Grid item container>
      <Grid item container direction="column" style={{ width: 335 }}>
        <label className={classes.label}>Google url code</label>
        <TextField
          disabled={disableInput}
          id="googleURL"
          variant="outlined"
          placeholder="Google url"
          className={classes.textField}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={state.googleURL}
          onChange={({ target }) =>
            handleInputChange("googleURL", target.value)
          }
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        style={{ width: 114, marginLeft: 16 }}
      >
        <label className={classes.label}>Apple code</label>
        <TextField
          disabled={disableInput}
          id="appleURL"
          variant="outlined"
          placeholder="Apple url"
          className={classes.textField}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={state.appleURL}
          onChange={({ target }) => handleInputChange("appleURL", target.value)}
        />
      </Grid>
    </Grid>
  </Fragment>
);
