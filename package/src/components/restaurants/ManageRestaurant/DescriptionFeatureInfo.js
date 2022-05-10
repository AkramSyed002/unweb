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

export const DescriptionFeatureInfo = ({
  classes,
  features,
  appOptions,
  description,
  handleInputChange,
  handleFeatureDelete,
  onDescriptionChange,
  handleDescriptionDelete,
}) => {
  const [currentDescription, setCurrentDescription] = useState("");

  const handleFeatureChange = (tags) => {
    const newTags = tags.map(({ label }) => label);

    handleInputChange('features',newTags)
  }

  const onCreateFeature = async (label, color) => {
    if(!label) return;
    const isExist = appOptions.find(({ label: tag }) => String(tag).toLowerCase() == String(label).toLowerCase());
    if(!isExist) await addFeaturesOption([...appOptions, label])

  };

  const onDeleteFeature = async (index) => {
    const tags = appOptions.filter((_, indx) => index !== indx)
    await addFeaturesOption(tags)

  };

  console.log(appOptions,'190898 features')

  return (
    <Fragment>
      <SuggestionDropdown
        classes={classes}
        options={features}
        title="Feature"
        defaultOptions={appOptions}
        selectedOptions={features}
        onChange={handleFeatureChange}
        onCreate={onCreateFeature}
        onDelete={onDeleteFeature}
        onItemDelete={handleFeatureDelete}
        // onItemChange={onFeatureChange}
      />
      <label className={classes.label}>Description</label>
      <Grid item container>
        <TextField
          id="description"
          variant="outlined"
          placeholder="Type something"
          className={classes.textField}
          value={currentDescription}
          InputProps={{
            className: classes.textFieldText,
          }}
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
