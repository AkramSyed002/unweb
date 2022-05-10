import React, { Fragment } from "react";
import { Button, Typography } from "@material-ui/core";

import { useHistory, useLocation } from "react-router-dom";

import SuccessCheck from "../../assets/images/checkCircle.png";
import { authStyles } from "./styles";
import { AuthLayout } from "./AuthLayout";
import { getPRSuccessMessage } from "../../utils/utils";
import { ROUTES } from "../../constants/routes";

const RenderSuccessMessage = ({ classes, history, message }) => (
  <Fragment>
    <img src={SuccessCheck} alt="success" />
    <Typography className={classes.resetPasswordTitle}>Success!</Typography>
    <Typography className={classes.subText}>{message}</Typography>
    <Button
      variant="outlined"
      fullWidth
      className={classes.resetButton}
      onClick={() => history.push(ROUTES.AUTH_LOGIN)}
    >
      Continue
    </Button>
  </Fragment>
);

const ResetPasswordSuccess = () => {
  const classes = authStyles();
  const history = useHistory();
  const location = useLocation();

  return (
    <AuthLayout>
      <RenderSuccessMessage
        classes={classes}
        history={history}
        message={getPRSuccessMessage(location.state.prevPath)}
      />
    </AuthLayout>
  );
};

export default ResetPasswordSuccess;
