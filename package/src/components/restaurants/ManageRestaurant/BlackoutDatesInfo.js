import React, { Fragment, useState } from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { formatDate } from "../../../utils/utils";

export const BlackoutDatesInfo = ({
  classes,
  dates,
  onAddDate,
  onDeleteDate,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  return (
    <Fragment>
      <label className={classes.label} style={{ marginTop: 32 }}>
        Blackout dates
      </label>
      <Grid item container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            // disablePast={true}
            InputAdornmentProps={{ position: "start" }}
            keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
            value={startDate}
            onChange={(date) => setStartDate(date)}
            style={{ width: 176, background: "#fff",}}
          />
          <span className={classes.label}>to</span>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            // disablePast={true}
            InputAdornmentProps={{ position: "start" }}
            keyboardIcon={<DateRangeIcon style={{ color: "#5EA0E0" }} />}
            value={endDate}
            onChange={(date) => setEndDate(date)}
            style={{ width: 176, background: "#fff" }}
          />
        </MuiPickersUtilsProvider>
        <Button
          variant="contained"
          className={classes.saveButton}
          style={{ marginTop: 10, marginLeft: 8 }}
          onClick={() => onAddDate(startDate, endDate)}
        >
          Add
        </Button>
      </Grid>
      {dates &&
        dates.map((el, i) => (
          <Typography
            key={i.toString()}
            className={classes.listItem}
            style={{ marginTop: 16 }}
          >
            {formatDate(el)}
            <Button
              variant="text"
              className={classes.deleteButton}
              style={{ marginLeft: 173 }}
              onClick={() => onDeleteDate(i)}
            >
              delete
            </Button>
          </Typography>
        ))}
    </Fragment>
  );
};
