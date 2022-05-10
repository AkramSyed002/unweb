import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import firebase from "firebase";
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { RenderTextField } from "./RenderTextField";
import { SuggestionDropdown } from "../../SuggestionDropdown";
import { RenderImage } from "../../RenderImage";
import { useAuth } from "../../../context/AuthContext";
import { USER_ROLES } from "../../../constants";

export const RenderBasicInfo = ({
  classes,
  handleInputChange,
  member,
  appOptions,
  allergiesOptions,
  dietaryOptions,
  restaurants,
  onDeleteTag,
  onTagChange,
  onCreateTag,
  onDeleteAllergies,
  onAllergiesChange,
  onCreateAllergies,
  onDeleteDietary,
  onDietaryChange,
  onCreateDietary,
  profileImage,
  onRefSelect,
  profileImageRef,
  onSelect,
  isViewMode,
}) => {
  const [home_location, setHomeLocation] = useState("");
  const [global_locations, setGlobalLocations] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    setHomeLocation(member.home_location);
    setGlobalLocations(member.global_locations);
  }, [member]);

  const handleHomeLocationChange = (_, value) => {
    setHomeLocation(value);
    handleInputChange("home_location", value);
  };

  const handleGlobalLocationsChange = (_, value) => {
    setGlobalLocations(value);
    handleInputChange("global_locations", value);
  };

  return (
    <Fragment>
      <Typography
        className={classes.subTitle}
        style={{
          marginTop: 64,
          fontFamily: "Avenir",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: 20,
          color: "#353535",
        }}
      >
        Basic Info
      </Typography>
      <Divider light />
      <Grid item container direction="column">
        <label className={classes.label}>Profile Image</label>
        <RenderImage
          image={profileImage}
          onRefSelect={onRefSelect}
          imageRef={profileImageRef}
          onSelect={onSelect}
          index={0}
          disabled={false}
        />
      </Grid>
      <Grid item container>
        <RenderTextField
          classes={classes}
          style={textFieldText}
          label="Title"
          id="title"
          placeholder="Title"
          onChange={({ target }) => handleInputChange("title", target.value)}
          value={member.title}
        />
        <RenderTextField
          style={textFieldText}
          classes={classes}
          style={{ width: 335, marginLeft: 16 }}
          label="Preferred Greeting"
          id="preferredGreeting"
          placeholder="Preferred Greeting"
          onChange={({ target }) =>
            handleInputChange("salutation", target.value)
          }
          value={member.salutation}
        />
      </Grid>

      <Grid item container>
        <RenderTextField
          style={textFieldText}
          classes={classes}
          style={{ width: 335 }}
          label="First Name"
          id="firstName"
          placeholder="First Name"
          onChange={({ target }) =>
            handleInputChange("first_name", target.value)
          }
          value={member.first_name}
        />
        <RenderTextField
          classes={classes}
          style={textFieldText}
          style={{ width: 335, marginLeft: 16 }}
          label="Last Name"
          id="lastName"
          placeholder="Last Name"
          onChange={({ target }) =>
            handleInputChange("last_name", target.value)
          }
          value={member.last_name}
        />
      </Grid>

      <label className={classes.label}>Profile Notes</label>
      <TextField
        id="title"
        fullWidth
        multiline
        rows={6}
        maxRows={6}
        variant="outlined"
        placeholder="ie. Dietary requirements, allergies"
        //   className={classes.textField}
        style={{ background: "#fff" }}
        InputProps={{
          className: classes.textFieldText,
        }}
        onChange={({ target }) =>
          handleInputChange("profile_notes", target.value)
        }
        value={member.profile_notes}
      />
      <SuggestionDropdown
        title="Tags"
        options={member.tags !== undefined ? member.tags : []}
        defaultOptions={appOptions}
        selectedOptions={member.tags}
        selectedItems={member.tags}
        onChange={onTagChange}
        onCreate={onCreateTag}
        onDelete={onDeleteTag}
      />
      <SuggestionDropdown
        title="Allergies"
        options={member.allergies !== undefined ? member.allergies : []}
        defaultOptions={allergiesOptions}
        selectedOptions={member.allergies}
        selectedItems={member.allergies}
        onChange={onAllergiesChange}
        onCreate={onCreateAllergies}
        onDelete={onDeleteAllergies}
      />
      <SuggestionDropdown
        title="Dietary Requirements"
        options={
          member.dietary_requirements !== undefined
            ? member.dietary_requirements
            : []
        }
        defaultOptions={dietaryOptions}
        selectedOptions={member.dietary_requirements}
        selectedItems={member.dietary_requirements}
        onChange={onDietaryChange}
        onCreate={onCreateDietary}
        onDelete={onDeleteDietary}
      />
      <Typography className={classes.label}>Home Location</Typography>
      <Autocomplete
        id="tags"
        value={home_location}
        options={restaurants.map(({ name }) => name)}
        onChange={handleHomeLocationChange}
        style={{ width: 390 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Home Location"
            style={{ background: "#fff" }}
          />
        )}
      />

      <Typography className={classes.label}>Global Locations</Typography>
      <Autocomplete
        multiple
        id="tags"
        limitTags={2}
        value={global_locations}
        options={restaurants.map(({ name }) => name)}
        disableCloseOnSelect
        onChange={handleGlobalLocationsChange}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </React.Fragment>
        )}
        style={{ width: 390 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Global Locations"
            style={{ background: "#fff" }}
          />
        )}
      />

      <label className={classes.label}>Birthday</label>
      <Grid item container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={
              isViewMode
                ? new Date(
                    member?.date_of_birth?.seconds
                      ? member?.date_of_birth?.seconds * 1000
                      : member?.date_of_birth
                  )
                : member.date_of_birth || new Date()
            }
            maxDate={new Date()}
            InputAdornmentProps={{ position: "start" }}
            onChange={(value) => handleInputChange("date_of_birth", value)}
            contol
            inputProps={{ style: { height: 40, width: 250 } }}
            style={{ background: "white" }}
            margin="dense"
          />
        </MuiPickersUtilsProvider>
      </Grid>
      {isViewMode && currentUser.role === USER_ROLES.ADMIN && (
        <Fragment>
          <Typography className={classes.subTitle} style={{ marginTop: 64 }}>
            Membership
          </Typography>
          <Divider light />
          <Grid container style={{ marginTop: 15 }}>
            <Grid item md={3} spacing={4}>
              <label className={classes.label}>Membership Start</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  value={
                    new Date(
                      member?.membership_start_date?.seconds
                        ? member?.membership_start_date?.seconds * 1000
                        : member?.membership_start_date
                    )
                  }
                  maxDate={new Date()}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={(value) =>
                    handleInputChange("membership_start_date", value)
                  }
                  contol
                  inputProps={{ style: { height: 40, width: 250 } }}
                  style={{ background: "white" }}
                  margin="dense"
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={3} style={{ marginLeft: 55 }}>
              <label className={classes.label}>Membership Paid</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  value={
                    new Date(
                      member?.membership_paid_date?.seconds
                        ? member?.membership_paid_date?.seconds * 1000
                        : member?.membership_paid_date
                    )
                  }
                  maxDate={new Date()}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={(value) =>
                    handleInputChange("membership_paid_date", value)
                  }
                  contol
                  inputProps={{ style: { height: 40, width: 250 } }}
                  style={{ background: "white" }}
                  margin="dense"
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={3} style={{ marginLeft: 55 }}>
              <label className={classes.label}>Membership End</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  value={
                    new Date(
                      member?.membership_end_date?.seconds
                        ? member?.membership_end_date?.seconds * 1000
                        : member?.membership_end_date
                    )
                  }
                  maxDate={new Date()}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={(value) =>
                    handleInputChange("membership_end_date", value)
                  }
                  contol
                  inputProps={{ style: { height: 40, width: 250 } }}
                  style={{ background: "white" }}
                  margin="dense"
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

const textFieldText = {
  width: 335,
  color: "#C0C0C0",
  fontFamily: "Avenir",
  fontStyle: "normal",
  fontWeight: 700,
  fontSize: 16,
};
