import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { InputBase, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MembersTabs from "../../components/members/MembersTabs";
import { useAppContext } from "../../context/AppContext";

const RenderHeader = ({ classes, onSearch }) => (
  <Grid item container alignItems="center">
    <Paper className={classes.root} elevation={0}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={({ target }) => onSearch(target.value)}
      />
    </Paper>
  </Grid>
);

let membersArrayHolder = [];
const Members = () => {
  const classes = useStyles();
  const [searchTab, setSearchTab] = useState("Active members");
  const { members } = useAppContext();
  const [activeMembers, setActiveMembers] = useState(members);
  const [pendingMembers, setPendingMembers] = useState(members);
  const [cancelledMembers, setCancelledMembers] = useState(members);

  useEffect(() => {

    setActiveMembers(members);
    setPendingMembers(members);
    setCancelledMembers(members);
  }, [members]);

  membersArrayHolder = members;

  const searchFilterFunction = (text) => {
    if (searchTab === "Active members") {
      const newData = membersArrayHolder.filter((item) => {
        const itemData =
          `${item.phone_number} ${item.email} ${item.first_name} ${item.last_name} ${item.tags} `.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setActiveMembers(newData);
    } else if (searchTab === "Pending members") {
      const newData = membersArrayHolder.filter((item) => {
        const itemData =
          `${item.phone_number} ${item.email} ${item.first_name} ${item.last_name} ${item.tags} `.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setPendingMembers(newData);
    } else {
      const newData = membersArrayHolder.filter((item) => {
        const itemData =
          `${item.phone_number} ${item.email} ${item.first_name} ${item.last_name} ${item.tags} `.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setCancelledMembers(newData);
    }
  };

  if (members === null) return <div />;

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <RenderHeader classes={classes} onSearch={searchFilterFunction} />
      <Typography className={classes.subTitle}>Members</Typography>
      <Typography className={classes.title}>Manage members</Typography>
      <MembersTabs
        onTabChange={(value) => setSearchTab(value)}
        activeMembers={activeMembers}
        pendingMembers={pendingMembers}
        cancelledMembers={cancelledMembers}
        allMembers={members}
      />
    </Grid>
  );
};

export default Members;

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 223,
  },
  root: {
    display: "flex",
    alignItems: "center",
    width: 335,
    height: 50,
    marginTop: 20,
    marginLeft: 40,
  },
  input: {
    flex: 1,
    fontFamily: "Avenir",
    border: "1.5px solid #E4E4E4",
    padding: 10,
    borderRadius: "8px",
    fontSize: 16
  },
  iconButton: {
    padding: 10,
  },
  title: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 34,
    // marginTop: 40,
    marginLeft: 40,
    fontFamily: "AvenirBold",
    fontStyle: "normal",
  },
  subTitle: {
    marginLeft: 40,
    marginTop: 40,
    color: "#C0C0C0",
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 13,
    lineHeight: "130%",
  },
}));
