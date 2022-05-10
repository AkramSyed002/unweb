import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

export const SnackbarAlert = ({
  visible,
  onClose,
  text,
  notification,
  type,
}) => {
  const anchorOrigin = notification
    ? { vertical: "top", horizontal: "right" }
    : { vertical: "bottom", horizontal: "right" };
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={visible}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <MuiAlert onClose={onClose} severity={type ? type : "success"}>
        {text}
      </MuiAlert>
    </Snackbar>
  );
};
