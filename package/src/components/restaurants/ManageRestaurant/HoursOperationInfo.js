import React, { Fragment, useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  Checkbox,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  MenuItem,
} from "@material-ui/core";

import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import { convertFrom24Hour } from "../../../utils/utils";

const RenderTimeRange = ({ classes, start, end, handleDayTime, index }) => {
  const startTime = convertFrom24Hour(start);
  const endTime = convertFrom24Hour(end);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        ariant="inline"
        inputVariant="outlined"
        showTodayButton
        value={startTime}
        onChange={(time) => handleDayTime(time, "start", index)}
        minutesStep={5}
        className={classes.timeRangeTextfield}
        InputProps={{
          className: classes.textFieldText,
        }}
        style={{ margin: "0px 0px 0px 10px" }}
      />
      <span className={classes.label}>to</span>
      <TimePicker
        ariant="inline"
        inputVariant="outlined"
        showTodayButton
        value={endTime}
        onChange={(time) => handleDayTime(time, "end", index)}
        minutesStep={5}
        className={classes.timeRangeTextfield}
        InputProps={{
          className: classes.textFieldText,
        }}
        style={{ margin: 0 }}
      />
    </MuiPickersUtilsProvider>
  );
};

const RenderDayTimeRange = ({
  classes,
  index,
  item,
  onTypeChange,
  toggleItemMealSlot,
  addMealSlot,
  changeMealSlotName,
  handleDayTime,
}) => {
  const [slotName, setSlotName] = useState("");
  return (
    <Grid item container>
      <Typography className={classes.dayLabel}>{item.day}</Typography>
      <TextField
        variant="outlined"
        value={item.type}
        className={classes.socialLinkSelect}
        placeholder="Open Hours"
        InputProps={{
          className: classes.textFieldText,
        }}
        select
        onChange={({ target }) => onTypeChange(target.value, index)}
      >
        <MenuItem value="Open Hours">Open Hours </MenuItem>
        <MenuItem value="Add B/L/D">Add B/L/D</MenuItem>
      </TextField>

      {item.type === "Add B/L/D" && (
        <Grid container direction="column" style={{ marginLeft: 52 }}>
          <Grid item>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#5EA0E0",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                textTransform: "none",
                margin: "10px 0px",
                width: 176,
                height: 55,
              }}
              onClick={() => addMealSlot(index)}
            >
              Add Meal Slots
            </Button>
          </Grid>
          {Object.entries(item).map(([key, value], i) => {
            if (key !== "day" && key !== "type")
              return (
                <Grid item key={i.toString()}>
                  {!item[key] &&
                    (key !== "Add other" ? (
                      <Button
                        variant="outlined"
                        style={{
                          border: "2px dashed #C0C0C0",
                          color: "#C0C0C0",
                          marginBottom: 10,
                          width: 176,
                          height: 55,
                        }}
                        onClick={() => toggleItemMealSlot(key, true, index)}
                      >
                        {key}{" "}
                        <AddCircleOutlineIcon style={{ marginLeft: "auto" }} />
                      </Button>
                    ) : (
                      <Fragment>
                        <TextField
                          variant="outlined"
                          style={{
                            width: 429,
                            marginBottom: 10,
                            backgroundColor: "#fff",
                          }}
                          placeholder="Custon meal slots"
                          InputProps={{
                            className: classes.textFieldText,
                          }}
                          onChange={({ target }) => setSlotName(target.value)}
                        />
                        <AddCircleOutlineIcon
                          onClick={() => changeMealSlotName(slotName, index)}
                          style={{ margin: "10px" }}
                        />
                      </Fragment>
                    ))}
                  {item[key] && (
                    <Fragment>
                      <Button
                        variant="outlined"
                        style={{
                          border: "2px dashed #C0C0C0",
                          color: "#C0C0C0",
                          marginBottom: 10,
                          width: 176,
                          height: 55,
                        }}
                        onClick={() => toggleItemMealSlot(key, true, index)}
                      >
                        {key}{" "}
                        <Checkbox
                          checked={true}
                          style={{ marginLeft: "auto" }}
                          onChange={() => {
                            toggleItemMealSlot(key, false, index);
                          }}
                          name="gilad"
                          color="primary"
                        />
                      </Button>
                      <RenderTimeRange
                        classes={classes}
                        start={item[key].start}
                        end={item[key].end}
                        //time is value from picker, value is key (start/end), index is days index (Sat/Sun), key is object key (lunch/dinner)
                        handleDayTime={(time, value, index) =>
                          handleDayTime(time, value, index, key)
                        }
                        index={index}
                      />
                    </Fragment>
                  )}
                </Grid>
              );
          })}
        </Grid>
      )}

      {item.type === "Open Hours" && (
        <RenderTimeRange
          classes={classes}
          start={item.start}
          end={item.end}
          handleDayTime={handleDayTime}
          index={index}
        />
      )}
    </Grid>
  );
};

export const HoursOperationInfo = ({
  classes,
  hoursOpen,
  temporaryClosed,
  onTemporarilyCloseChange,
  handleDayCheck,
  handleDayTime,
  handleDayTypeChange,
  toggleItemMealSlot,
  addMealSlot,
  changeMealSlotName,
}) => {
  return (
    <Fragment>
      <label className={classes.subTitle} style={{ marginTop: 64 }}>
        Hours of Operation
      </label>
      <Divider light />
      <Grid item container style={{ margin: "16px 0px" }}>
        <Typography style={{ fontWeight: 500, fontSize: 13 }}>Day</Typography>
      </Grid>

      {hoursOpen.map((el, index) => (
        <RenderDayTimeRange
          classes={classes}
          item={el}
          index={index}
          onTypeChange={handleDayTypeChange}
          toggleItemMealSlot={toggleItemMealSlot}
          addMealSlot={addMealSlot}
          changeMealSlotName={changeMealSlotName}
          handleDayTime={handleDayTime}
        />
      ))}

      <Grid item container style={{ marginTop: 16 }}>
        <Typography className={classes.closeRestaurant}>
          Temporarily close restaurant
        </Typography>
        <Checkbox
          className={classes.closeRestCheckbox}
          checked={temporaryClosed}
          value={temporaryClosed}
          onChange={onTemporarilyCloseChange}
          color="primary"
        />
      </Grid>
    </Fragment>
  );
};
