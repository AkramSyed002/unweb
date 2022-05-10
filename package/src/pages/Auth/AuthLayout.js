import { Grid } from "@material-ui/core";
import React from "react";

import Right from "../../assets/images/Right.png";
import { authStyles } from "./styles";

export const AuthLayout = ({ children }) => {
  const classes = authStyles();
  return (
    <Grid container>
      <Grid
        item
        container
        xl
        lg
        md
        sm
        xs
        className={classes.leftContainer}
        justify="center"
        alignItems="center"
      >
        <Grid
          item
          container
          direction="column"
          className={classes.resetPasswordContaier}
          justify="center"
          alignItems="center"
        >
          {children}
        </Grid>
      </Grid>
      <Grid item container xl lg md sm xs>
        <img src={Right} alt="Right Side image" className={classes.rightSide} />
      </Grid>
    </Grid>
  );
};
