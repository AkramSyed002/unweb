import { Typography } from "@material-ui/core";
import React from "react";

export const PinCodeBoxes = ({ pinCode, width = '30%' }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: width,
        marginTop: 12,
      }}
    >
      {pinCode && pinCode !== "" && pinCode.split("").map((el) => (
        <div
          style={{
            height: 70,
            width: 50,
            backgroundColor: "white",
            border: "1px solid #C0C0C0",
            borderRadius: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#353535",
            }}
          >
            {el}
          </Typography>{" "}
        </div>
      ))}
    </div>
  );
};
