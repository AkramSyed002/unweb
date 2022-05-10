import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  Button,
  Grid,
  Divider,
  Avatar,
  Chip,
  Fab,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import Scrollbar from "react-scrollbars-custom";
import { USER_ROLES, USER_ROLES_FLOW } from "../../../constants/index";
import { useAuth } from "../../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 480,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    top: "2.5em",
    left: "35%",
    textAlign: "center",
    borderRadius: 16,
  },
  title: {
    color: "#727272",
    fontSize: 20,
    fontWeight: 500,
    marginTop: 15,
    marginBottom: 16,
    fontFamily: "Avenir",
  },
  name: {
    color: "#353535",
    fontSize: 28,
    fontWeight: 700,
    // marginTop: 15,
    // marginBottom: 16,
  },
  subTitle: {
    color: "#646464",
    fontSize: 14,
    fontWeight: 400,
    marginBottom: "1em",
    fontFamily: "Avenir",
  },
  editButton: {
    fontWeight: 600,
    fontSize: 16,
    background: "#5EA0E0",
    color: "#fff",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    fontFamily: "Avenir",
  },
  deleteButton: {
    fontWeight: 600,
    fontSize: 16,
    color: "#1665D8",
    textAlign: "center",
    width: 335,
    height: 52,
    textTransform: " none",
    marginTop: 16,
    fontFamily: "Avenir",
  },
  avatar: {
    width: 150,
    height: 150,
    marginTop: 40,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
}));

export default function AdminDetailsModal({
  adminDetailsModal,
  handleAdminDetailsModalClose,
  onEditClick,
  onDeleteClick,
  adminDetails,
}) {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [canEdit, setCanEdit] = useState(true);

  const {
    first_name,
    last_name,
    email,
    location_access,
    phone_number,
    photo_url,
    role,
  } = adminDetails;
  const body = (
    <Scrollbar style={{ height: 740 }}>
      <Grid
        container
        direction="column"
        justify="center"
        className={classes.paper}
      >
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleAdminDetailsModalClose}
            style={{
              marginTop: -40,
              marginRight: -50,
              background: "#1D244D",
              color: "#fff",
            }}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Typography className={classes.title}>
          {first_name} {last_name}
        </Typography>
        <Divider light />
        <Grid item container justify="center">
          <Avatar src={photo_url} className={classes.avatar} />
        </Grid>
        <Typography className={classes.name}>
          {first_name} {last_name}
        </Typography>
        <Typography className={classes.title}>
          {email} <br /> {phone_number} <br />
          Access type here
        </Typography>
        <Grid item style={{ marginTop: 18, marginBottom: 40 }}>
          {location_access.map((chip) => (
            <Chip label={chip.name} className={classes.chip} />
          ))}
        </Grid>

        {canEdit && (
          <Grid item container direction="column" alignItems="center">
            <Button
              fullWidth
              className={classes.editButton}
              onClick={onEditClick}
            >
              Edit
            </Button>
            <Button
              fullWidth
              variant="outlined"
              className={classes.deleteButton}
              onClick={onDeleteClick}
            >
              Delete
            </Button>
          </Grid>
        )}
      </Grid>
    </Scrollbar>
  );

  useEffect(() => {
    checkIfCanEdit();
  }, []);

  const checkIfCanEdit = () => {
    if (currentUser.role === USER_ROLES.ADMIN) return setCanEdit(true);
    const currentAdminIndex = USER_ROLES_FLOW.map((e) => e.role).indexOf(
      currentUser.role
    );
    console.log(currentUser.role)
    const selectedAdminLocations = location_access.map((el) => el.id);
    let matchRestaurants =
      currentUser.location_access.filter((o1) =>
        selectedAdminLocations.some((o2) => o1 === o2)
      ).length > 0;
    // 1st check if both have locations matches
    if (matchRestaurants) {
      // 2nd check if lower staff from current

      const otherAdminIndex = USER_ROLES_FLOW.map((e) => e.role).indexOf(role);
      if (currentAdminIndex >= otherAdminIndex) {
        setCanEdit(true);
      } else setCanEdit(false);
    } else {
      setCanEdit(false);
    }
  };

  return (
    <Modal open={adminDetailsModal} onClose={handleAdminDetailsModalClose}>
      {body}
    </Modal>
  );
}
