import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";

export const PublicRoute = ({ component: Component, ...rest }) => {
   const {currentAuth} = useAuth(); 
  return (
    
    <Route
      {...rest}
      render={(props) =>
        currentAuth ? (
          <Redirect to={{
            pathname: !rest?.location?.redirect ? ROUTES.DASHBOARD_MANAGE_REST : rest?.location?.redirect + rest?.location?.search
          }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
