import React, { memo, useMemo } from "react";
import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import { getImageUrl } from "../utils/utils";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import DeleteIcon from "@material-ui/icons/Delete";

export const RenderImage = ({
  image,
  imageRef,
  onRefSelect,
  onSelect,
  index,
  disabled,
  deleteImage,
  noDelete,  
}) => {
  return (
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

        {image && !noDelete && !disabled && (
          <IconButton
            aria-label="delete"
            style={{
              position: "absolute",
              top: "-95px",
              left: "60px",
              padding: "6px",
              margin: "0px",
              color: "#000",
              fontSize: "20px",
              backgroundColor: "#fff",
            }}
            onClick={(e) => {
              deleteImage(index);
              e.stopPropagation();
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
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
  );
};
// useMemo(
//   () => (
//     <Grid
//       item
//       container
//       alignItems="center"
//       justify="center"
//       style={{
//         backgroundImage: image && getImageUrl(image),
//         backgroundPosition: "center",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         border: image && "none",
//         cursor: !disabled && "pointer",
//         width: 200,
//         height: 200,
//         border: !image && "#C0C0C0 dashed 2px",
//         borderRadius: 8,
//         marginRight: 8,
//       }}
//       onClick={() => onRefSelect(index)}
//     >
//       <div style={{ position: "relative" }}>
//         <input
//           style={{ display: "none" }}
//           type="file"
//           onChange={({ target }) => onSelect(target.files[0], index)}
//           ref={imageRef}
//           accept="image/*"
//           disabled={disabled}
//         />

//         {image && (
//           <IconButton
//             aria-label="delete"
//             style={{
//               position: "absolute",
//               top: "-95px",
//               left: "60px",
//               padding: "6px",
//               margin: "0px",
//               color: "#000",
//               fontSize: "20px",
//               backgroundColor: "#fff",
//             }}
//             onClick={(e) => {
//               deleteImage(index);
//               e.stopPropagation();
//             }}
//           >
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         )}

//         {/* {image && (<Button disableElevationstyle={{position:"absolute",top:"-95px", left:"30px", padding:"0px", margin:"0px",color:"#fff",fontSize:"20px"}} size="small" variant="" color="default">X</Button>)} */}
//       </div>
//       {!image && (
//         <>
//           <ControlPointIcon color="primary" />
//           <Typography style={{ cursor: disabled ? "default" : "pointer" }}>
//             Add New Photo
//           </Typography>
//         </>
//       )}
//     </Grid>
//   ),
//   [image, disabled]
// );
