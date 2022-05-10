import React from "react";
import { Grid } from "@material-ui/core";

import SideDrawer from "../SideBar/SideDrawer";

const AppLayout = ({ children }) => {
  return (
    <Grid container>
      <SideDrawer />
      {children}
    </Grid>
  );
};

export default AppLayout;
