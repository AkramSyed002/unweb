import React from "react";
import { Route, Redirect } from "react-router-dom";
import PageLoader from "../PageLoader";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../layout/AppLayout";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentAuth, loginLoading } = useAuth();

  if (loginLoading) return <PageLoader />;

  return (
    <Route
      {...rest}
      render={(props) =>
        currentAuth ? (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        ) : (
          <Redirect
            to={{
              pathname: ROUTES.AUTH_LOGIN,
              search: rest?.location?.search,
              redirect: rest?.location?.pathname,
            }}
          />
        )
      }
    />
  );
};
