import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, CircularProgress, Modal } from "@material-ui/core";

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

export default function LoadingModal({ modalVisible }) {  
  return (
    <Modal open={modalVisible}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    </Modal>
  );
}
