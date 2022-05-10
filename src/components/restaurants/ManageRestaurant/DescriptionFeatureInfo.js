import React, { Fragment, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Chip,
  Typography,
  Divider,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { addFeaturesOption } from "../../../firebase/services";
import { useAppContext } from "../../../context/AppContext";
import { SuggestionDropdown } from "../../SuggestionDropdown";
import { FeatureDropdown } from "../../FeatureDropdown";

export const DescriptionFeatureInfo = ({
  classes,
  features,
  appOptions,
  description,
  handleInputChange,
  handleFeatureDelete,
  onDescriptionChange,
  handleDescriptionDelete,
  disableInput
}) => {
  const [currentDescription, setCurrentDescription] = useState("");

  const handleFeatureChange = (tags) => {
    handleInputChange("features", tags);
  };

  const onCreateFeature = async (label, color) => {
    if (!label) return;
    const isExist = appOptions.find(
      ({ label: tag }) =>
        String(tag).toLowerCase() == String(label).toLowerCase()
    );
    if (!isExist) await addFeaturesOption([...appOptions, label]);
  };

  const onDeleteFeature = async (index) => {
    const tags = appOptions.filter((_, indx) => index !== indx);
    await addFeaturesOption(tags);
  };

  return (
    <Fragment>
      {/* <FeatureDropdown /> */}
      {/* <SuggestionDropdown
        disabled={disableInput}
        classes={classes}
        title="Feature"
        defaultOptions={appOptions}
        selectedOptions={features}
        onChange={handleFeatureChange}
        onCreate={onCreateFeature}
        onDelete={onDeleteFeature}
        onItemDelete={handleFeatureDelete}
        // onItemChange={onFeatureChange}
      /> */}
      <label className={classes.label}>Description</label>
      <Grid item container>
        <TextField
          disabled={disableInput}
          id="description"
          variant="outlined"
          placeholder="Type something"
          className={classes.textField}
          InputProps={{
            className: classes.textFieldText,
          }}
          value={currentDescription}
          onChange={({ target }) => setCurrentDescription(target.value)}
        />
        <Button
          variant="contained"
          className={classes.saveButton}
          style={{ marginTop: 10, marginLeft: 8 }}
          onClick={() => {
            onDescriptionChange(currentDescription);
            setCurrentDescription("");
          }}
          disabled={currentDescription === ""}
        >
          Add
        </Button>
      </Grid>
      <ul style={{ paddingLeft: 16 }}>
        {description &&
          description.map((el, index) => (
            <li key={index.toString()} className={classes.listItem}>
              {el}
              <Button
                onClick={() => handleDescriptionDelete(index)}
                variant="text"
                className={classes.deleteButton}
              >
                delete
              </Button>
            </li>
          ))}
      </ul>
    </Fragment>
  );
};
