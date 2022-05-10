import React, { Fragment } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Checkbox,
  Select,
} from "@material-ui/core";
import PhoneInput from 'react-phone-input-2'

export const BasicInfo = ({
  classes,
  type,
  countryCode,
  setCountryCode,
  handleInputChange,
  state,
}) => (
  <Fragment>
    <Typography className={classes.subTitle}>Basic Info</Typography>
    <Divider light />
    <label className={classes.label}>Location name</label>
    <Grid item container>
      <TextField
        id="location"
        variant="outlined"
        className={classes.textField}
        value={state.name}
        InputProps={{
          className: classes.textFieldText,
        }}
        onChange={({ target }) => handleInputChange("name", target.value)}
      />
      <Select
        id="type"
        variant="outlined"
        defaultValue={state.type}
        className={classes.locationStatusSelect}
        onChange={({ target }) => handleInputChange("type", target.value)}
        style={{
          backgroundColor:
            state.type === "permanent"
              ? "#70C78D"
              : state.type === "popUp"
                ? "#CF9F2B"
                : state.type === "archived"
                  ? "#727272"
                  : "#FF8888",
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
        <MenuItem value="permanent" style={{ color: "#70C78D" }}>
          Permanent
        </MenuItem>
        <MenuItem value="popUp" style={{ color: "#CF9F2B" }}>
          Pop Up
        </MenuItem>
        <MenuItem value="archived" style={{ color: "#727272" }}>
          Archived
        </MenuItem>
        <MenuItem value="seasonal" style={{ color: "#FF8888" }}>
          Seasonal
        </MenuItem>
      </Select>
    </Grid>

    <Grid item container>
      <Grid item container direction="column" style={{ width: 335 }}>
        <label className={classes.label}>Email</label>
        <TextField
          id="email"
          variant="outlined"
          className={classes.textField}
          placeholder="Email"
          value={state.email}
          onChange={({ target }) => handleInputChange("email", target.value)}
          InputProps={{
            className: classes.textFieldText,
          }}
        />
      </Grid>
    </Grid>

    <Grid item container>
      <Grid item container direction="column" style={{ width: 335 }}>
        <label className={classes.label}>Phone Number</label>
        <PhoneInput
          country={'us'}
          // onlyCountries={['us', 'fr', 'it']}
          inputStyle={{ width: '100%', height: '56px' }}
          value={state.contact}
          onChange={(value) => handleInputChange("contact", value)}
        />
      </Grid>
    </Grid>
  </Fragment>
);
