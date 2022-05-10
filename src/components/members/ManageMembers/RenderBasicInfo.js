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
  Select,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DateRangeIcon from "@material-ui/icons/DateRange";

import { RenderTextField } from "./RenderTextField";
import { SuggestionDropdown } from "../../SuggestionDropdown";

import { useAuth } from "../../../context/AuthContext";
import {
  ALLERGIES_OPTIONS,
  DIETARY_OPTIONS,
  MEMBER_TAGS,
  TITLE_OPTIONS,
  USER_ROLES,
} from "../../../constants";
import { RenderImageMemo } from "../../RenderImageMemo";
import { SuggestionDropdownUD } from "../../SuggestionDropdownUD";

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
  const [home_restaurant, setHomeLocation] = useState("");
  const [title, setTitle] = useState("");
  const [global_locations, setGlobalLocations] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    setHomeLocation(member.home_restaurant);
    setGlobalLocations(member.global_locations);
    setTitle(member.title);
  }, [member]);

  const handleHomeLocationChange = (_, value) => {
    setHomeLocation(value);
    handleInputChange("home_restaurant", value);
  };

  const handleTitleChange = (_, value) => {
    setTitle(value);
    handleInputChange("title", value);
  };

  const handleGlobalLocationsChange = (_, value) => {
    setGlobalLocations(value);
    handleInputChange("global_locations", value);
  };

  if (currentUser === null) return <div />;
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
        Basic info
      </Typography>
      <Divider light />
      <Grid item container direction="column">
        <label className={classes.label}>Profile image</label>
        <RenderImageMemo
          image={profileImage}
          onRefSelect={onRefSelect}
          imageRef={profileImageRef}
          onSelect={onSelect}
          index={0}
          disabled={false}
        />
      </Grid>
      <Typography className={classes.label}>Title</Typography>
      <Autocomplete
        id="tags"
        value={title}
        options={TITLE_OPTIONS}
        onChange={handleTitleChange}
        style={{ width: 335 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Title"
            style={{ background: "#fff" }}
          />
        )}
      />
      <Grid item container>
        <RenderTextField
          style={textFieldText}
          classes={classes}
          label="Preferred greeting"
          id="preferredGreeting"
          placeholder="Preferred greeting"
          onChange={({ target }) =>
            handleInputChange("salutation", target.value)
          }
          value={member.salutation}
        />
      </Grid>

      <Grid item container>
        <RenderTextField
          classes={classes}
          style={{ width: 335 }}
          label="First name *"
          id="firstName"
          placeholder="First name"
          onChange={({ target }) =>
            handleInputChange("first_name", target.value)
          }
          value={member.first_name}
        />
        <RenderTextField
          classes={classes}
          style={{ width: 335, marginLeft: 16 }}
          label="Last name *"
          id="lastName"
          placeholder="Last name"
          onChange={({ target }) =>
            handleInputChange("last_name", target.value)
          }
          value={member.last_name}
        />
      </Grid>

      <label className={classes.label}>Profile notes</label>
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
      <SuggestionDropdownUD
        title="Tags"
        options={MEMBER_TAGS}
        selectedOptions={member.tags}
        onChange={onTagChange}
      />

      <SuggestionDropdownUD
        title="Allergies"
        options={ALLERGIES_OPTIONS}
        selectedOptions={member.allergies}
        onChange={onAllergiesChange}
      />
      <SuggestionDropdownUD
        title="Dietary requirements"
        options={DIETARY_OPTIONS}
        selectedOptions={member.dietary_requirements}
        onChange={onDietaryChange}
      />
      {/* <SuggestionDropdown
        title="Allergies"
        options={member.allergies !== undefined ? member.allergies : []}
        defaultOptions={allergiesOptions}
        selectedOptions={member.allergies}
        
        onChange={onAllergiesChange}
        onCreate={onCreateAllergies}
        onDelete={onDeleteAllergies}
      /> */}

      <Typography className={classes.label}>Home location</Typography>
      <Autocomplete
        id="tags"
        value={home_restaurant}
        options={restaurants.map(({ name }) => name)}
        onChange={handleHomeLocationChange}
        style={{ width: 390 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Home location"
            style={{ background: "#fff" }}
          />
        )}
      />

      <Typography className={classes.label}>Global locations</Typography>
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
            variant="outlined"
            placeholder="Global Locations"
            style={{ background: "#fff" }}
            InputProps={{
              className: classes.dropdown,
            }}
            {...params}
          />
        )}
      />

      <label className={classes.label}>Birthday</label>
      <Grid item container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
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
            InputAdornmentProps={{ position: "start" }}
            keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
            onChange={(value) => handleInputChange("date_of_birth", value)}
            className={classes.textField}
          />
          {/* <KeyboardDatePicker
            openTo="date"
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
          /> */}
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
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  defaultValue={new Date()}
                  value={
                    member.membership_start_date === "" ||
                    member.membership_start_date === undefined
                      ? null
                      : new Date(
                          member?.membership_start_date?.seconds
                            ? member?.membership_start_date?.seconds * 1000
                            : member?.membership_start_date
                        )
                  }
                  InputAdornmentProps={{ position: "start" }}
                  keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
                  onChange={(value) =>
                    handleInputChange("membership_start_date", value)
                  }
                  className={classes.textField}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={3} style={{ marginLeft: 55 }}>
              <label className={classes.label}>Membership Paid</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  value={
                    member.membership_paid_date === "" ||
                    member.membership_paid_date === undefined
                      ? null
                      : new Date(
                          member?.membership_paid_date?.seconds
                            ? member?.membership_paid_date?.seconds * 1000
                            : member?.membership_paid_date
                        )
                  }
                  InputAdornmentProps={{ position: "start" }}
                  keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
                  onChange={(value) =>
                    handleInputChange("membership_paid_date", value)
                  }
                  className={classes.textField}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={3} style={{ marginLeft: 55 }}>
              <label className={classes.label}>Membership End</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  value={
                    member.membership_end_date === "" ||
                    member.membership_end_date === undefined
                      ? null
                      : new Date(
                          member?.membership_end_date?.seconds
                            ? member?.membership_end_date?.seconds * 1000
                            : member?.membership_end_date
                        )
                  }
                  InputAdornmentProps={{ position: "start" }}
                  keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
                  onChange={(value) =>
                    handleInputChange("membership_end_date", value)
                  }
                  className={classes.textField}
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
  fontWeight: 800,
  fontSize: 16,
};
