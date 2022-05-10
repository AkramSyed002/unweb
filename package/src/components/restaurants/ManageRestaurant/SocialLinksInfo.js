import React, { Fragment, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Checkbox,
  Select,
} from "@material-ui/core";
import { ROUTES } from "../../../constants/routes";

export const SocialLinksInfo = ({
  classes,
  socialLinks,
  history,
  handleInputChange,
  onAddList,
  onDeleteList,
}) => (
  <Fragment>
    <label className={classes.subTitle} style={{ marginTop: 60 }}>
      Social links
    </label>
    <Divider light />
    {socialLinks.map((el, i) => (
      <RenderSocialInputs
        type={el.type}
        link={el.link}
        onAddPress={onAddList}
        onRemovePress={onDeleteList}
        index={i}
        classes={classes}
        onInputChange={handleInputChange}
        arrayLength={socialLinks.length}
      />
    ))}
  </Fragment>
);

const RenderSocialInputs = ({
  onInputChange,
  type,
  link,
  onAddPress,
  onRemovePress,
  index,
  classes,
  arrayLength,
}) => (
  <Grid item container alignItems="center">
    <Grid item container direction="column" style={{ width: 114 }}>
      <label className={classes.label}>Platform</label>
      <TextField
        id="locationStatus"
        variant="outlined"
        value={type}
        className={classes.socialLinkSelect}
        InputProps={{
          className: classes.textFieldText,
        }}
        select
        onChange={({ target }) => onInputChange("type", target.value, index)}
      >
        <MenuItem value="Facebook">Facebook</MenuItem>
        <MenuItem value="Instagram">Instagram </MenuItem>
        <MenuItem value="YouTube">YouTube</MenuItem>
      </TextField>
    </Grid>
    <Grid item style={{ marginTop: 43, marginLeft: 70 }}>
      <TextField
        id="link"
        value={link}
        variant="outlined"
        placeholder="facebook/url"
        className={classes.textField}
        InputProps={{
          className: classes.textFieldText,
        }}
        onChange={({ target }) => onInputChange("link", target.value, index)}
      />
    </Grid>
    <Grid item style={{ marginTop: 43, marginLeft: 9 }}>
      {arrayLength !== 1 && (
        <Button
          variant="contained"
          className={classes.removeButton}
          disableFocusRipple={true}
          onClick={() => onRemovePress(index)}
        >
          Remove -
        </Button>
      )}
      {arrayLength - 1 === index && (
        <Button
          variant="contained"
          className={classes.saveButton}
          disableFocusRipple={true}
          onClick={onAddPress}
        >
          Add +
        </Button>
      )}
    </Grid>
  </Grid>
);
