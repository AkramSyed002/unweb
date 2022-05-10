import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Button,
  Grid,
  ButtonGroup,
} from "@material-ui/core";
import Scrollbar from "react-scrollbars-custom";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.paper,
    top: "13em",
    left: "35%",
    borderRadius: 12,
  },
  title: {
    color: "#202020",
    fontSize: 16,
    fontWeight: 600,
    marginBottom: "0.5em",
    textAlign: "center",
    margin: 16,
    padding: 16,
  },
  buttonGroup: {
    borderTop: "#E5E5E5 solid 1px",
    borderRadius: 0,
    height: 60,
  },
  confirmButton: {
    fontWeight: 700,
    fontSize: 16,
    color: "#FF8888",
    textTransform: "none",
  },
  cancelButton: {
    fontWeight: 700,
    fontSize: 16,
    color: "#727272",
    textTransform: "none",
  },
}));

export default function DeleteMemberModal({
  deleteMemberModal,
  handleDeleteMemberModalClose,
}) {
  const classes = useStyles();

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <div className={classes.paper}>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ height: 168 }}
        >
          <Typography className={classes.title}>
            Are you sure you want to delete this user?
          </Typography>
        </Grid>
        <ButtonGroup
          disableElevation
          variant="text"
          fullWidth
          className={classes.buttonGroup}
        >
          <Button
            className={classes.cancelButton}
            onClick={handleDeleteMemberModalClose}
          >
            Cancel
          </Button>
          <Button
            className={classes.confirmButton}
            onClick={() => {
              handleDeleteMemberModalClose();
            }}
          >
            Yes, Delete
          </Button>
        </ButtonGroup>
      </div>
    </Scrollbar>
  );

  return (
    <Modal open={deleteMemberModal} onClose={handleDeleteMemberModalClose}>
      {body}
    </Modal>
  );
}
