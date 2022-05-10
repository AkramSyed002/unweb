import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MemberProfileTabs from "../../components/members/membersProfile/MemberProfileTabs";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  headerTitle: {
    marginTop: 110,
    marginLeft: -52,
    color: "#353535",
    fontSize: 34,
    fontWeight: 700,
    fontFamily: "AvenirBold",
    fontStyle: "normal",
  },
}));

const MemberProfile = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.mainContainer}>
      <Typography
        style={{
          fontFamily: "Avenir",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: 13,
          color: "#C0C0C0",
          marginTop: 100,
        }}
      >
        Members
      </Typography>
      <Typography className={classes.headerTitle}>Member profile</Typography>
      <MemberProfileTabs />
    </Grid>
  );
};

export default MemberProfile;
