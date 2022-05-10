import React, { useState, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Button,
  Grid,
  Divider,
  Fab,
  TextField,
  Checkbox,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  Chip,
} from "@material-ui/core";

import { Scrollbar } from "react-scrollbars-custom";

import CloseIcon from "@material-ui/icons/Close";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 820,
    backgroundColor: theme.palette.background.paper,
    padding: "0px 40px 18px 40px",
    top: 18,
    left: "27%",
    borderRadius: 16,
  },
  title: {
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 10,
    // marginBottom: 7,
  },
  bookingTitle: {
    color: "#353535",
    fontSize: 28,
    fontWeight: 700,
    marginTop: -15,
  },
  subTitle: {
    color: "#353535",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 39,
  },
  saveButton: {
    fontWeight: 600,
    fontSize: 16,
    background: "#5EA0E0",
    color: "#fff",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    "&:hover": {
      color: "#727272",
    },
  },
  cancelButton: {
    fontWeight: 600,
    fontSize: 16,
    color: "#1665D8",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    border: "2px solid #727272",
    marginRight: 32,
  },
  textField: {
    width: 300,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#353535",
  },
  fabButton: {
    marginTop: -15,
    marginRight: -60,
    background: "#1D244D",
    color: "#fff",
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 16,
    color: "#C0C0C0",
  },
  checkboxLabel: {
    fontWeight: 700,
    fontSize: 16,
    color: "#353535",
  },
  deleteSelected: {
    color: "#FF8888",
    fontSize: 16,
    fontWeight: 700,
    marginLeft: "auto",
    cursor: "pointer",
  },
  locationContainer: {
    width: 265,
    height: 150,
    border: "1px solid #C0C0C0",
    borderRadius: 4,
    background: "#fff",
    padding: 16,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
  imageContainer: {
    width: 200,
    height: 200,
    border: "#C0C0C0 dashed 2px",
    borderRadius: 8,
    marginRight: 8,
    marginTop: 20,
  },
}));

const RenderTextFieled = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  indorment,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
        startAdornment: indorment,
      }}
    />
  </Grid>
);

export default function EditItemModal({ editItemModal, handleClose, record }) {
  const classes = useStyles();

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Typography className={classes.bookingTitle}>Edit Item</Typography>

        <Grid
          item
          container
          alignItems="center"
          justify="center"
          className={classes.imageContainer}
        >
          <ControlPointIcon color="primary" />
          <Typography>Add hero photo</Typography>
        </Grid>
        <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="ITEM NAME"
            id="itemName"
            placeholder="ITEM NAME"
            value="Item Name Lorem Ips|"
          />
          <RenderTextFieled
            classes={classes}
            style={{ width: 335, marginLeft: 16 }}
            label="PRICE"
            id="price"
            placeholder="PRICE"
            value="$ 00.00"
          />
        </Grid>
        <label className={classes.label}>DESCRIPTION</label>
        <TextField
          variant="outlined"
          rows={3}
          multiline
          style={{ width: 685 }}
        />

        <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="TAGS"
            id="tags"
            placeholder="TAGS"
            value="TAGS"
          />
          <Grid
            item
            container
            alignItems="flex-end"
            style={{ width: "50%", marginLeft: 16, marginBottom: 8 }}
          >
            <Chip
              label="Vegan"
              onDelete={() => {}}
              className={classes.chip}
              style={{
                color: "#70C78D",
                background: "#F1F4F4",
              }}
            />
            <Chip
              label="Nut Allergy"
              onDelete={() => {}}
              className={classes.chip}
              style={{ color: "#FF8888", background: "#FFF4F4" }}
            />
          </Grid>
        </Grid>
        <Typography className={classes.subTitle}>
          Category Information
        </Typography>
        <Divider light />
        <Grid item container>
          <Grid item container direction="column" style={{ width: 306 }}>
            <label className={classes.label}>CATEGORY</label>
            <Select
              id="category"
              variant="outlined"
              placeholder="CATEGORY"
              className={classes.textField}
              defaultValue="Menu"
              InputProps={{
                className: classes.textFieldText,
              }}
            >
              <MenuItem value="Menu">Menu</MenuItem>
              <MenuItem value="item1">Item 1</MenuItem>
              <MenuItem value="item2">Item 2</MenuItem>
              <MenuItem value="item3">Item 3</MenuItem>
            </Select>
          </Grid>
          <RenderTextFieled
            classes={classes}
            style={{ width: 310, marginLeft: 16 }}
            label="SECTION HEADING"
            id="sectionHeading"
            placeholder="SECTION HEADING"
            value={record && record.subHeading}
          />
          <Grid
            item
            container
            direction="column"
            justifyContent="flex-end"
            style={{ width: 80, marginBottom: 5 }}
          >
            <label className={classes.label}>PRICE</label>
            <TextField
              variant="outlined"
              id="price"
              placeholder="Price"
              value={record && record.price}
            />
          </Grid>
        </Grid>

        <Typography className={classes.subTitle}>Select Location</Typography>
        <Divider light />
        <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="SEARCH LOCATION"
            id="sectionSubHeading"
            placeholder="SEARCH LOCATION"
          />
          <Grid
            item
            container
            alignItems="flex-end"
            style={{ width: "50%", marginLeft: 16, marginBottom: 8 }}
          >
            <Chip label="Boston" onDelete={() => {}} className={classes.chip} />
            <Chip
              label="New York"
              onDelete={() => {}}
              className={classes.chip}
            />
            <Chip label="Miami" onDelete={() => {}} className={classes.chip} />
          </Grid>
        </Grid>

        <Grid className={classes.locationContainer}>
          <Typography
            style={{
              color: "#C0C0C0",
              fontWeight: 500,
              fontSize: 13,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Select
          </Typography>
          <Grid item container direction="column" style={{ width: 120 }}>
            <Chip
              label="Private Dining"
              style={{ marginBottom: 8, borderRadius: 4 }}
            />
            <Chip label="Bar" style={{ marginBottom: 8, borderRadius: 4 }} />
            <Chip
              label="Terrace"
              style={{ marginBottom: 8, borderRadius: 4 }}
            />
          </Grid>
        </Grid>

        <Grid item container justify="center" style={{ marginTop: 20 }}>
          <Button className={classes.cancelButton}>Cancel</Button>
          <Button className={classes.saveButton}>Save Changes</Button>
        </Grid>
      </Grid>
    </Scrollbar>
  );

  return (
    <Modal open={editItemModal} onClose={handleClose}>
      {body}
    </Modal>
  );
}
