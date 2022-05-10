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
    left: "42%",
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
    textTransform: "none",
  },
  cancelButton: {
    fontWeight: 700,
    fontSize: 16,
    color: "#727272",
    textTransform: "none",
  },
}));

export default function AlertModal({
  modalVisible,
  handleClose,
  onConfirmClick,
  description,
  informative,
  btnText = "Yes, delete it",
  btn2Text = "Cancel",
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
          <Typography className={classes.title}>{description}</Typography>
        </Grid>
        <ButtonGroup
          disableElevation
          variant="text"
          fullWidth
          className={classes.buttonGroup}
        >
          <Button disableElevationclassName={classes.cancelButton} onClick={handleClose}>
            {btn2Text}
          </Button>
          <Button
            style={{
              color: informative ? "#337AB7" : "#FF8888",
            }}
            className={classes.confirmButton}
            onClick={onConfirmClick}
          >
            {btnText}
          </Button>
        </ButtonGroup>
      </div>
    </Scrollbar>
  );

  return (
       <Modal open={modalVisible} onClose={handleClose} >
             {body}
      </Modal> 
   
  );
}
