import React, { Fragment, useRef, useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { RenderImage } from "../../RenderImage";

export const ImagesInfo = ({ classes, images, onSelect }) => {
  const ref = useRef();

  const [reference, setReference] = useState([ref]);

  useEffect(() => {
    if(images) {
      const refs = [];
      images?.map(() => refs.push(ref))
      setReference([...refs, ref])
    }
  },[images])

  const onRefSelect = (index) => {
    reference[index].current.click();
  };

  const handleSelect = (value, index) => {
    onSelect(value, index);
    setReference([...reference, ref])
  }

  return (
    <Fragment>
      <label className={classes.label} style={{ marginTop: 64 }}>
        Images
      </label>
      <Grid item container>
        {
          reference.map((ref, index) => (
            <RenderImage
              image={images[index]}
              onRefSelect={onRefSelect}
              imageRef={ref}
              onSelect={handleSelect}
              classes={classes}
              index={index}
            />
          ))
        }
      </Grid>
    </Fragment>
  );
};
