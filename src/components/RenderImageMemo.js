import React, { useMemo } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { getImageUrl } from "../utils/utils";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

export const RenderImageMemo = ({
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
          marginTop: 2,
        }}
        onClick={() => onRefSelect(index)}
      >
        <div style={{ position: "relative" }}>
          <input
            style={{ display: "none" }}
            type="file"
            onChange={({ target }) =>
              onSelect(target.files[0], index, image ? false : true)
            }
            ref={imageRef}
            accept="image/*"
            disabled={disabled}
          />
        </div>
        {!image && (
          <>
            <ControlPointIcon color="primary" />
            <Typography
              style={{
                cursor: disabled ? "default" : "pointer",
                marginLeft: 5,
                fontFamily: "Avenir",
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              Add New Photo
            </Typography>
          </>
        )}
      </Grid>
    ),
    [image, disabled]
  );
