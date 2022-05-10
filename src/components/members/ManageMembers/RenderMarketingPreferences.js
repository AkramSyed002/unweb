import { Checkbox, Divider, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import React, { Fragment } from 'react'

export const RenderMarketingPreferences = ({ classes, handleInputChange, member }) => (
  <Fragment>
    <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
      Marketing Preferences
    </Typography>
    <Divider light />
    <FormGroup column>
      <FormControlLabel
        style={formControlStyle}
        control={
          <Checkbox
            value={member.marketing_email}
            onChange={() =>
              handleInputChange("marketing_email", !member.marketing_email)
            }
            checked={member.marketing_email}
            name="emailCheckbox"
            color="primary"
          />
        }
        label="Opt in via Email"
      />
      <FormControlLabel
        style={formControlStyle}

        control={
          <Checkbox

            value={member.marketing_sms}
            onChange={() =>
              handleInputChange("marketing_sms", !member.marketing_sms)
            }
            checked={member.marketing_sms}
            name="smsCheckbox"
            color="primary"
          />
        }
        label="Opt in via SMS Text Message"
      />
      <FormControlLabel
        style={formControlStyle}
        control={
          <Checkbox
            value={member.marketing_promotional_material}
            onChange={() =>
              handleInputChange(
                "marketing_promotional_material",
                !member.marketing_promotional_material
              )
            }
            checked={member.marketing_promotional_material}
            name="outOfAllCheckbox"
            color="primary"
          />
        }
        label="Opt out of all promotional materials."
      />
    </FormGroup>
  </Fragment>
);



const formControlStyle = {

  fontFamily: "Avenir",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: 16,

}