import React, { Fragment, useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";

import { useHistory } from "react-router-dom";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { useAuth } from "../../context/AuthContext";
import { authStyles } from "./styles";
import { AuthLayout } from "./AuthLayout";
import { ROUTES } from "../../constants/routes";

const RenderPasswordTextField = ({
  showPassword,
  classes,
  handleClickShowPassword,
  handleMouseDownPassword,
  value,
  handleChange,
  label,
  name,
}) => (
  <TextField
    variant="outlined"
    label={label}
    name={name}
    fullWidth
    type={showPassword ? "text" : "password"}
    value={value}
    onChange={handleChange}
    className={classes.textField}
    inputProps={{
      className: classes.input,
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const RenderResetPassword = ({
  showPassword,
  classes,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleChange,
  password,
  confirmPassword,
  handlePasswordReset,
}) => (
  <Fragment>
    <RenderPasswordTextField
      label="Password"
      name="password"
      value={password}
      showPassword={showPassword}
      classes={classes}
      handleClickShowPassword={handleClickShowPassword}
      handleMouseDownPassword={handleMouseDownPassword}
      handleChange={handleChange}
    />
    <RenderPasswordTextField
      label="Confirm Password"
      name="confirmPassword"
      value={confirmPassword}
      showPassword={showPassword}
      classes={classes}
      handleClickShowPassword={handleClickShowPassword}
      handleMouseDownPassword={handleMouseDownPassword}
      handleChange={handleChange}
    />
    <Button
      variant="outlined"
      fullWidth
      className={
        password || confirmPassword
          ? classes.resetButton
          : classes.resetButtonDisabled
      }
      disabled={password || confirmPassword ? false : true}
      onClick={handlePasswordReset}
    >
      Reset Password
    </Button>
  </Fragment>
);

const ResetPassword = () => {
  const classes = authStyles();
  const history = useHistory();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { sendResetPassword } = useAuth();

  const handleChange = (e) => {
    switch (e.target.name) {
      case "password":
        setPassword(e.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordReset = () => {
    history.push(ROUTES.AUTH_RESET_PASSWORD_SUCCESS, {
      prevPath: ROUTES.AUTH_RESET_PASSWORD,
    });
  };

  return (
    <AuthLayout>
      <Typography className={classes.resetPasswordTitle}>
        Reset Password
      </Typography>
      <Typography className={classes.subText}>
        We will send you an email with a one-time link to reset your password.
      </Typography>

      <RenderResetPassword
        classes={classes}
        handleChange={handleChange}
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        handlePasswordReset={handlePasswordReset}
      />
    </AuthLayout>
  );
};

export default ResetPassword;
