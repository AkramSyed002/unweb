import React from "react";
import { Grid, TextField } from "@material-ui/core";

export const RenderTextField = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  onChange,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      onChange={onChange}
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
    />
  </Grid>
);
