import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { useAuth } from "../../context/AuthContext";
import { validateEmail } from "../../utils/utils";
import { AuthLayout } from "./AuthLayout";
import { ROUTES } from "../../constants/routes";
import { authStyles } from "./styles";

const Login = () => {
  const classes = authStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();

  useEffect(() => {
    setDisabled(!validateEmail(email) || password === "");
  }, [email, password]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
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

  const handleLogin = async () => {
    if (error) setError(null);
    try {
      setLoading(true);
      await loginUser(email, password);
      setLoading(false);
      history.push("/")
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.log("Error login user", err);
    }
  };

  return (
    <AuthLayout>
      <Typography className={classes.signInTitle}>Sign in</Typography>
      <TextField
        variant="outlined"
        label="Email"
        name="email"
        fullWidth
        value={email}
        onChange={handleChange}
        className={classes.textField}
        inputProps={{
          className: classes.input,
        }}
      />
      <TextField
        variant="outlined"
        label="Password"
        name="password"
        fullWidth
        type={showPassword ? "text" : "password"}
        value={password}
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
      <Grid item container justify="flex-end">
        <Typography
          className={classes.forgotPassword}
          onClick={() => history.push(ROUTES.AUTH_SEND_RESET_PASSWORD)}
        >
          Forgot Password?
        </Typography>
      </Grid>
      {error && <Typography className={classes.errorText}>{error}</Typography>}
      <Button
        variant="outlined"
        fullWidth
        className={
          !disabled && !loading
            ? classes.loginButton
            : classes.loginButtonDisabled
        }
        disabled={disabled && !loading}
        onClick={handleLogin}
      >
        Log in
      </Button>
    </AuthLayout>
  );
};

export default Login;
