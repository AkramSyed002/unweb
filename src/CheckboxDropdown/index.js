import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { MenuProps, useStyles, options } from "./utils";

function CheckboxDropdown({ selectedValues, onCheckboxClick }) {
  const classes = useStyles();
  const [selected, setSelected] = useState(
    selectedValues ? selectedValues : []
  );

  const handleChange = (event) => {
    let value = event.target.value;
    if (value[value.length - 1] === "archive") {
      setSelected(["archive"]);
      value = ["archive"];
    } else {
      if (value.includes("archive")) {
        value = value.filter((e) => e !== "archive");
      }
      setSelected(value);
    }
    onCheckboxClick(value);
  };

  return (
    <FormControl style={{ marginLeft: 20, width: 300 }}>
      <Select
        variant="outlined"
        labelId="mutiple-select-label"
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
        style={{ textTransform: "capitalize", backgroundColor: "white" }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option) > -1} />
            </ListItemIcon>
            <ListItemText
              primary={option}
              style={{ textTransform: "capitalize" }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CheckboxDropdown;
