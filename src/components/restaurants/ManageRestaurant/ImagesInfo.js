import React, { Fragment, useState, useEffect, createRef } from "react";
import { Grid, Typography } from "@material-ui/core";
import { RenderImage } from "../../RenderImage";

export const ImagesInfo = ({ classes, images, onSelect, deleteImage, disableInput }) => {
  const ref = createRef();

  const [reference, setReference] = useState([ref]);

  useEffect(() => {
    if (images) {
      const refs = [];
      images?.map(() => refs.push(ref));
      setReference([...refs, createRef()]);
    }
  }, [images]);

  const onRefSelect = (index) => {
    reference[index].current.click();
  };

  const handleSelect = (value, index, addNew) => {
    onSelect(value, index);
    if (addNew) {
      setReference([...reference, ref]);
    }
  };

  const onDeleteClick = (index) => {
    let temp = [...reference];
    temp.splice(index, 1);
    deleteImage(index);
    setReference(temp);
  };

  return (
    <Fragment>
      <label className={classes.label} style={{ marginTop: 64 }}>
        Images
      </label>

      <Grid item container>
        {reference.map((ref, index) => (
          <RenderImage
            image={images[index]}
            onRefSelect={onRefSelect}
            imageRef={ref}
            onSelect={handleSelect}
            classes={classes}
            index={index}
            deleteImage={onDeleteClick}
            disabled={disableInput}
          />
        ))}
      </Grid>
    </Fragment>
  );
};
