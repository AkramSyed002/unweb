import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SettingsTabs from "../../components/settings/SettingsTabs";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  headerTitle: {
    marginTop: 110,
    marginBottom: 10,
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
    fontFamily: "Avenir ",
  },
}));

export const Settings = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.mainContainer}>
      <Typography className={classes.headerTitle}>Settings</Typography>
      <SettingsTabs />
    </Grid>
  );
};
