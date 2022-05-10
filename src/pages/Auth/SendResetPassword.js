import React, { Fragment, useState } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { validateEmail } from "../../utils/utils";
import { authStyles } from "./styles";

import { AuthLayout } from "./AuthLayout";
import { ROUTES } from "../../constants/routes";

const SendResetPassword = () => {
  const classes = authStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { sendResetPassword } = useAuth();

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;

      default:
        break;
    }
  };

  const sendLink = async () => {
    if (error) setError(null);
    try {
      setLoading(true);
      await sendResetPassword(email);
      setLoading(false);
      history.push(ROUTES.AUTH_RESET_PASSWORD_SUCCESS, {
        prevPath: ROUTES.AUTH_SEND_RESET_PASSWORD,
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.log("Error reset password", err);
    }
  };

  return (
    <AuthLayout>
      <Typography className={classes.resetPasswordTitle}>
        Reset Password
      </Typography>
      <Typography className={classes.subText}>
        We will send you an email with a one-time link to reset your password.
      </Typography>
      <Fragment>
        <TextField
          variant="outlined"
          label="Email"
          name="email"
          value={email}
          onChange={handleChange}
          fullWidth
          className={classes.textField}
          inputProps={{
            className: classes.input,
          }}
        />
        {error && (
          <Typography className={classes.errorText}>{error}</Typography>
        )}
        <Button
          variant="outlined"
          fullWidth
          className={
            validateEmail(email) && !loading
              ? classes.resetButton
              : classes.resetButtonDisabled
          }
          disabled={validateEmail(email) && !loading ? false : true}
          onClick={sendLink}
        >
          Send link
        </Button>
      </Fragment>
    </AuthLayout>
  );
};

export default SendResetPassword;
