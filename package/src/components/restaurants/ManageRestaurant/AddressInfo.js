import React, { Fragment } from 'react'
import { Grid, Typography, Divider, TextField } from '@material-ui/core'
import { CountryPickers } from '../../CountryPickers'

export const AddressInfo = ({
  classes,
  handleInputChange,
  state,
  countryNames,
}) => (
    <Fragment>
      <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
        Address
    </Typography>
      <Divider light />
      <label className={classes.label}>Country</label>
      {/* <TextField
      id="country"
      variant="outlined"
      placeholder="Country"
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
      value={state.country}
      onChange={({ target }) => handleInputChange('country', target.value)}
    /> */}

      {/* <Select
      variant="outlined"
      className={classes.textField}
      placeholder={'Select Country'}
      options={countryNames}
      value={state.country}
      onChange={({ target }) => handleInputChange('country', target.value)}
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#000',
        fontFamily: 'Avenir',
      }}
    >
      {countryNames.map((element, index) => (
        <MenuItem value={element} key={index}>
          {Object.values(element.label)}
        </MenuItem>
      ))}
    </Select> */}

      <CountryPickers
        // variant="contained"
        placeholder="Select Country"
        options={countryNames}
        value={state.countryNames}
        onChange={(target) => handleInputChange('country', target.value)}
      />

      <label className={classes.label}>Address</label>
      <TextField
        id="addressLine1"
        variant="outlined"
        placeholder="Address Line 1"
        className={classes.textField}
        InputProps={{
          className: classes.textFieldText,
        }}
        value={state.address_line_1}
        onChange={({ target }) =>
          handleInputChange('address_line_1', target.value)
        }
      />
      <TextField
        id="addressLine1"
        variant="outlined"
        placeholder="Address Line 2"
        className={classes.textField}
        InputProps={{
          className: classes.textFieldText,
        }}
        value={state.address_line_2}
        onChange={({ target }) =>
          handleInputChange('address_line_2', target.value)
        }
      />

      <Grid item container>
        <Grid item container direction="column" style={{ width: 335 }}>
          <label className={classes.label}>City</label>
          <TextField
            id="city"
            variant="outlined"
            placeholder="City"
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
            value={state.city}
            onChange={({ target }) => handleInputChange('city', target.value)}
          />
        </Grid>

        <Grid
          item
          container
          direction="column"
          style={{ width: 114, marginLeft: 16 }}
        >
          <label className={classes.label}>State</label>
          <TextField
            id="state"
            variant="outlined"
            placeholder="State"
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
            value={state.state}
            onChange={({ target }) => handleInputChange('state', target.value)}
          />
        </Grid>
      </Grid>
      <label className={classes.label}>Postal Code</label>
      <TextField
        id="postalCode"
        variant="outlined"
        placeholder="Postal Code"
        className={classes.textField}
        InputProps={{
          className: classes.textFieldText,
        }}
        value={state.postal_code}
        onChange={({ target }) => handleInputChange('postal_code', target.value)}
      />
      <Grid item container>
        <Grid item container direction="column" style={{ width: 335 }}>
          <label className={classes.label}>Google URL Code</label>
          <TextField
            id="googleURL"
            variant="outlined"
            placeholder="Google URL"
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
            value={state.googleURL}
            onChange={({ target }) => handleInputChange('googleURL', target.value)}
          />
        </Grid>
        <Grid
          item
          container
          direction="column"
          style={{ width: 114, marginLeft: 16 }}
        >
          <label className={classes.label}>Apple Code</label>
          <TextField
            id="appleURL"
            variant="outlined"
            placeholder="Apple URL"
            className={classes.textField}
            InputProps={{
              className: classes.textFieldText,
            }}
            value={state.appleURL}
            onChange={({ target }) => handleInputChange('appleURL', target.value)}
          />
        </Grid>
      </Grid>
    </Fragment>
  )
