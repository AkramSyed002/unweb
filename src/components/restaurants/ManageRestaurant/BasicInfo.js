// import React, { Fragment, useState } from "react";
// import {
//   Grid,
//   Typography,
//   Button,
//   Divider,
//   TextField,
//   MenuItem,
//   Checkbox,
//   Select,
// } from "@material-ui/core";
// import PhoneInput from "react-phone-input-2";
// import { validateEmail } from "../../../utils/utils";

// export const BasicInfo = ({ classes, handleInputChange, state, disableInput }) => {
//   const [emailError, setEmailError] = useState(false);

//   return(
//   <Fragment>
//     <Typography className={classes.subTitle}>Basic info</Typography>
//     <Divider light />
//     <label className={classes.label}>Location name *</label>
//     <Grid item container>
//       <TextField
//         disabled={disableInput}
//         id="location"
//         variant="outlined"
//         className={classes.textField}
//         value={state.name}
//         InputProps={{
//           className: classes.textFieldText,
//         }}
//         onChange={({ target }) => handleInputChange("name", target.value)}
//         placeholder="Location name"
//       />
//       <Select
//         disabled={disableInput}
//         id="type"
//         variant="outlined"
//         defaultValue={state.type}
//         className={classes.locationStatusSelect}
//         onChange={({ target }) => handleInputChange("type", target.value)}
//         style={{
//           backgroundColor:
//             state.type === "permanent"
//               ? "#70C78D"
//               : state.type === "popUp"
//               ? "#CF9F2B"
//               : state.type === "archived"
//               ? "#727272"
//               : state.type === "seasonal & new"
//               ? "#FF5555"
//               : "#FF8888",
//         }}
//         margin="dense"
//         MenuProps={{
//           anchorOrigin: {
//             vertical: "bottom",
//             horizontal: "left",
//           },
//           getContentAnchorEl: null,
//         }}
//       >
//         <MenuItem value="permanent" style={{ color: "#70C78D" }}>
//           Permanent
//         </MenuItem>
//         <MenuItem value="popUp" style={{ color: "#CF9F2B" }}>
//           Pop Up
//         </MenuItem>
//         <MenuItem value="archived" style={{ color: "#727272" }}>
//           Archived
//         </MenuItem>
//         <MenuItem value="seasonal" style={{ color: "#FF8888" }}>
//           Seasonal
//         </MenuItem>
//         <MenuItem value="seasonal & new" style={{ color: "#FF5555" }}>
//           Seasonal & New
//         </MenuItem>
//       </Select>
//     </Grid>

//     <Grid item container>
//       <Grid item container direction="column" style={{ width: 335 }}>
//         <label className={classes.label}>Email</label>
//         <TextField
//           disabled={disableInput}
//           id="email"
//           variant="outlined"
//           className={classes.textField}
//           placeholder="Email"
//           value={state.email}
//           onChange={({ target }) => handleInputChange("email", target.value)}
//           onBlur={() => {
//             if (!validateEmail(state.email)) setEmailError(true);
//             else setEmailError(false);
//           }}
//           InputProps={{
//             className: classes.textFieldText,
//           }}
//         />
//         {emailError && <span style={{ color: "red" }}>Invalid Email</span>}
//       </Grid>
//     </Grid>

//     <Grid item container>
//       <Grid item container direction="column" style={{ width: 335 }}>
//         <label className={classes.label}>Phone number *</label>
//         <PhoneInput
//           disabled={disableInput}
//           country={"us"}
//           // onlyCountries={['us', 'fr', 'it']}
//           inputStyle={{
//             width: "100%",
//             height: "56px",
//             fontSize: 16,
//             fontWeight: 700,
//             // color: '#C0C0C0',
//             color: "#000",
//             fontFamily: "Avenir",
//           }}
//           value={state.contact}
//           onChange={(value) => handleInputChange("contact", value)}
//         />
//       </Grid>
//     </Grid>
//   </Fragment>
// )};
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
import PhoneInput from "react-phone-input-2";
import { validateEmail } from "../../../utils/utils";
import CheckboxDropdown from "../../../CheckboxDropdown";

export const BasicInfo = ({
  classes,
  handleInputChange,
  state,
  disableInput,
}) => {
  const [emailError, setEmailError] = useState(false);

  return (
    <Fragment>
      <Typography className={classes.subTitle}>Basic info</Typography>
      <Divider light />
      <label className={classes.label}>Location name *</label>
      <Grid item container>
        <TextField
          disabled={disableInput}
          id="location"
          variant="outlined"
          className={classes.textField}
          value={state.name}
          InputProps={{
            className: classes.textFieldText,
          }}
          onChange={({ target }) => handleInputChange("name", target.value)}
          placeholder="Location name"
        />
        <CheckboxDropdown
          selectedValues={state.type}
          onCheckboxClick={(value) => handleInputChange("type", value)}
        />
        {/* <Select
          disabled={disableInput}
          id="type"
          variant="outlined"
          defaultValue={state.type}
          className={classes.locationStatusSelect}
          onChange={({ target }) => handleInputChange("type", target.value)}
          style={{
            backgroundColor:
              state.type === "permanent"
                ? "#70C78D"
                : state.type === "popUp"
                ? "#CF9F2B"
                : state.type === "archived"
                ? "#727272"
                : state.type === "seasonal & new"
                ? "#FF5555"
                : "#FF8888",
          }}
          margin="dense"
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
        >
          <MenuItem value="permanent" style={{ color: "#70C78D" }}>
            Permanent
          </MenuItem>
          <MenuItem value="popUp" style={{ color: "#CF9F2B" }}>
            Pop Up
          </MenuItem>
          <MenuItem value="archived" style={{ color: "#727272" }}>
            Archived
          </MenuItem>
          <MenuItem value="seasonal" style={{ color: "#FF8888" }}>
            Seasonal
          </MenuItem>
          <MenuItem value="seasonal & new" style={{ color: "#FF5555" }}>
            Seasonal & New
          </MenuItem>
        </Select> */}
      </Grid>

      <Grid item container>
        <Grid item container direction="column" style={{ width: 335 }}>
          <label className={classes.label}>Email</label>
          <TextField
            disabled={disableInput}
            id="email"
            variant="outlined"
            className={classes.textField}
            placeholder="Email"
            value={state.email}
            onChange={({ target }) => handleInputChange("email", target.value)}
            onBlur={() => {
              if (!validateEmail(state.email)) setEmailError(true);
              else setEmailError(false);
            }}
            InputProps={{
              className: classes.textFieldText,
            }}
          />
          {emailError && <span style={{ color: "red" }}>Invalid Email</span>}
        </Grid>
      </Grid>

      <Grid item container>
        <Grid item container direction="column" style={{ width: 335 }}>
          <label className={classes.label}>Phone number *</label>
          <PhoneInput
            disabled={disableInput}
            country={"us"}
            // onlyCountries={['us', 'fr', 'it']}
            inputStyle={{
              width: "100%",
              height: "56px",
              fontSize: 16,
              fontWeight: 700,
              // color: '#C0C0C0',
              color: "#000",
              fontFamily: "Avenir",
            }}
            value={state.contact}
            onChange={(value) => handleInputChange("contact", value)}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};
