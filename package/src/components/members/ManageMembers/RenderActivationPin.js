import React, { Fragment } from "react";
import { Divider, Typography } from "@material-ui/core";
import { PinCodeBoxes } from "../../PinCodeBoxes";

export const RenderActivationPin = ({ classes, pinCode }) => {
  return (
    <Fragment>
      <Typography className={classes.title}>New Member Profile</Typography>
      <Typography className={classes.subTitle}>
        Account Activation Pin
      </Typography>
      <Divider light />
      <Typography style={{
        fontWeight: 500,
        fontSize: 16,
        fontFamily: "Avenir",
        fontStyle: "italic",

      }}>
        This will be used to create a new account.
      </Typography>
      <PinCodeBoxes pinCode={pinCode} />
    </Fragment>
  );
};
