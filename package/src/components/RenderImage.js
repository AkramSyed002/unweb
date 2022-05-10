import React, { memo, useMemo } from "react";
import { Grid, Typography } from "@material-ui/core";
import { getImageUrl } from "../utils/utils";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

export const RenderImage = ({
  image,
  imageRef,
  onRefSelect,
  onSelect,
  index,
  disabled,
}) =>
  useMemo(
    () => (
      <Grid
        item
        container
        alignItems="center"
        justify="center"
        style={{
          backgroundImage: image && getImageUrl(image),
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: image && "none",
          cursor: !disabled && "pointer",
          width: 200,
          height: 200,
          border: !image && "#C0C0C0 dashed 2px",
          borderRadius: 8,
          marginRight: 8,
        }}
        onClick={() => onRefSelect(index)}
      >
        <input
          style={{ display: "none" }}
          type="file"
          onChange={({ target }) => onSelect(target.files[0], index)}
          ref={imageRef}
          accept="image/*"
          disabled={disabled}
        />
        {!image && (
          <>
            <ControlPointIcon color="primary" />
            <Typography style={{ cursor: disabled ? "default" : "pointer" }}>
              Add New Photo
            </Typography>
          </>
        )}
      </Grid>
    ),
    [image, disabled]
  );
