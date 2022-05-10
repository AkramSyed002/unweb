import React, { Fragment, useState } from "react";
import { Grid, Divider, Button, TextField } from "@material-ui/core";

const BookingDescriptionRow = ({
  classes,
  onChange,
  type,
  description,
  index,
  disabled
}) => (
  <Grid item container style={{ marginTop: 22 }}>
    <TextField
      disabled={disabled}
      variant="outlined"
      InputProps={{
        className: classes.textFieldText,
      }}
      style={{
        width: "20%",
        background: "#fff",
        height: 55,
        marginRight: 22,
      }}
      placeholder={"Template..."}
      value={type}
      onChange={({ target }) => onChange("type", target.value, index)}
    />
    <TextField
      disabled={disabled}
      variant="outlined"
      InputProps={{
        className: classes.textFieldText,
      }}
      style={{
        width: "73%",
        background: "#fff",
        height: 55,
        marginRight: 22,
      }}
      placeholder={"Description...."}
      value={description}
      onChange={({ target }) => onChange("description", target.value, index)}
    />
  </Grid>
);

export const BookingConfirmation = ({
  classes,
  items,
  addBookingSlot,
  onBookingTextChange,
  disableInput
}) => {
  return (
    <Fragment>
      <label className={classes.subTitle} style={{ marginTop: 64 }}>
        Booking confirmation
      </label>
      <Divider light />
      <Fragment>
        <TextField
          disabled={disableInput}
          fullWidth
          value={items[0].description}
          variant="outlined"
          multiline={true}
          rows={3}
          placeholder="Default booking confirmation information"
          style={{ margin: "16px 0px", backgroundColor: "#fff" }}
          InputProps={{
            className: classes.textFieldText,
          }}
          onChange={({ target }) =>
            onBookingTextChange("description", target.value, 0)
          }
        />

        <Grid item container justifyContent="flex-end">
          <Button
            disabled={disableInput}
            variant="contained"
            color="primary"
            style={{
              color: "#fff",
              textTransform: "none",
              fontSize: 16,
              fontWeight: 500,
            }}
            onClick={addBookingSlot}
            disableElevation
          >
            Add custom confirmation
          </Button>
        </Grid>
      </Fragment>
      <label style={{ marginTop: -10, color: "#C0C0C0", fontFamily: "Avenir" }}>
        Custom confirmations
      </label>
      {items &&
        items.map(
          (el, index) =>
            index !== 0 && (
              <BookingDescriptionRow
              disabled={disableInput}
                classes={classes}
                textFieldPlaceholder="Inclement weather"
                descPlaceholder="Inclement weather Description"
                index={index}
                onChange={onBookingTextChange}
                type={el.type}
                description={el.description}
              />
            )
        )}
    </Fragment>
  );
};

{
  /* <BookingDescriptionRow
classes={classes}
textFieldPlaceholder="Inclement weather"
descPlaceholder="Inclement weather Description"
/> */
}
