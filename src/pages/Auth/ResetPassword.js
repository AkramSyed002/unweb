import React, { Fragment, useEffect, useState } from "react";
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
import PageLoader from "../../components/PageLoader";
import { auth } from "../../firebase/firebase";
import { updateAdmin } from "../../firebase/services";

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
  handleLogout,
  loading,
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
      className={!loading ? classes.resetButton : classes.resetButtonDisabled}
      disabled={loading}
      onClick={handlePasswordReset}
    >
      Reset Password
    </Button>
    <Button
      variant="text"
      fullWidth
      style={{ marginTop: 24, fontSize: 16, color: "#F61D1E" }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  </Fragment>
);

const ResetPassword = () => {
  const classes = authStyles();
  const history = useHistory();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const { currentUser, setCurrentUser, currentAuth, logoutUser } = useAuth();

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

  useEffect(() => {
    if (currentUser !== null) {
      if (!currentUser.isPasswordChanged) setPageLoading(false);
      else {
        setPageLoading(false);
        history.push(ROUTES.DASHBOARD_MANAGE_REST);
      }
    }
  }, [currentUser]);

  const handlePasswordReset = async () => {
    if (confirmPassword !== password)
      return alert("Password and confirm password does not match");
    var user = auth.currentUser;
    setLoading(true);
    try {
      await user.updatePassword(password);
      await updateAdmin(currentAuth.uid, { isPasswordChanged: true });
      let temp = Object.assign({}, currentUser);
      temp.isPasswordChanged = true;
      setCurrentUser(temp);
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
    logoutUser();
    history.push("/login");
  };

  if (pageLoading) return <PageLoader />;

  return (
    <AuthLayout>
      <Typography className={classes.resetPasswordTitle}>
        Reset Password
      </Typography>
      {/* <Typography className={classes.subText}>
        We will send you an email with a one-time link to reset your password.
      </Typography> */}

      <RenderResetPassword
        classes={classes}
        handleChange={handleChange}
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        handlePasswordReset={handlePasswordReset}
        handleLogout={handleLogout}
        loading={loading || password == "" || confirmPassword !== password}
      />
    </AuthLayout>
  );
};

export default ResetPassword;
