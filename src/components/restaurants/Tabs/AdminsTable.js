import React, { useState, Fragment, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useAppContext } from "../../../context/AppContext";
import {
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Grid,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Link, useHistory } from "react-router-dom";
import AdminDetailsModal from "../modals/AdminDetailsModal";
import { deleteAdmin, firestoreSortByKey } from "../../../firebase/services";
import { ROUTES } from "../../../constants/routes";
import { CollectionNames, USER_ROLES } from "../../../constants";
import AlertModal from "../../members/modals/AlertModal";
import { formattedPhoneNumber } from "../../../utils/utils";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: "#C0C0C0",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "Avenir",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    // boxShadow: "0px -3px 50px -13px rgba(0,0,0,0.05)",
  },
}))(TableRow);

const EnhancedTableToolbar = ({
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  count,
}) => {
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Administrators{" "}
        <a style={{ color: "#C0C0C0", marginLeft: 16, fontFamily: 'Avenir', fontWeight: 800 }}>{count}</a>
      </Typography>
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list">
          <FilterListIcon
            aria-controls="filterMenu"
            aria-haspopup="true"
            onClick={handleFilterClick}
            className={classes.filterIcon}
          />
          <Menu
            id="filterMenu"
            anchorEl={filterAnchorEl}
            keepMounted
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            elevation={2}
            className={classes.filterMenu}
          >
            <Grid
              container
              direction="column"
              style={{ width: 282, padding: 16 }}
            >
              <Typography className={classes.subName}>Sort by</Typography>
              <MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose("Alphabetical")}
              >
                Alphabetical
              </MenuItem>
              {/*<MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose('Phone')}
              >
                Phone number
              </MenuItem>*/}
              <MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose("Role")}
              >
                Role
              </MenuItem>
            </Grid>
          </Menu>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "#F8F8F8",
    padding: 16,
    paddingBottom: 32,
    marginBottom: 16,
    marginTop: 32,
  },
  table: {
    minWidth: 700,
    // backgroundColor: theme.palette.action.hover,
    background: "#F8F8F8",
  },
  title: {
    flex: "1 1 100%",
    fontFamily: "AvenirBold",
    fontSize: 22,
    fontWeight: 700,
    marginLeft: -10,
  },
  restName: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 18,
    cursor: "pointer",
    borderRadius: "8px 0px 0px 8px",
    border: "none",
    fontFamily: "Avenir",
  },
  subName: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    border: "none",
    textDecoration: "none",
  },
  rightBorderRadius: {
    borderRadius: "0px 8px 8px 0px",
    border: "none",
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
    color: "#727272",
    marginTop: 5,
    textDecoration: "none;",
  },
  filterItem: {
    fontWeight: 500,
    fontSize: 16,
    marginLeft: -16,
  },
  headerTitle: {
    backgroundColor: "#F8F8F8",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
    fontFamily: "Avenir",
  },
  filterIcon: {
    border: "#C0C0C0 solid 1px",
    borderRadius: 4,
    color: "#C0C0C0",
  },
  filterTitle: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    border: "none",
  },
  filterLabel: {
    width: "70%",
    fontSize: 16,
    fontWeight: 500,
    color: "#353535",
  },
  filterCheckbox: {
    width: "15%",
    marginLeft: "auto",
    marginTop: -10,
  },
  filterMenu: {
    marginTop: "5em",
    marginLeft: -80,
    borderRadius: 8,
  },
}));

export default function AdminsTable({ admins, handleDeleteAdmin }) {
  const classes = useStyles();
  const history = useHistory();
  const [currentAdmins, setCurrentAdmins] = useState([]);
  const [adminDetailsModal, setAdminDetailsModal] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [deleteMemberModal, setDeleteMemberModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { setAdmins } = useAppContext();
  useEffect(() => setCurrentAdmins(admins), [admins]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setCurrentAdmins(admins);
  }, [admins]);

  const handleFilterClose = async (filter) => {
    let sortedAdmins = [];
    if (!filter) return;
    if (filter === "Alphabetical") {
      setCurrentAdmins([]);
      const sorted = await firestoreSortByKey(
        CollectionNames.ADMIN,
        "first_name",
        "asc"
      );
      sorted.map(({ ...rest }) => {
        const location_access = admins.find(
          ({ id }) => id == rest.id
        )?.location_access;
        sortedAdmins.push({ ...rest, location_access });
      });
      setCurrentAdmins([...sortedAdmins]);
      setAdmins([...sortedAdmins]);
    } else if (filter === "Role") {
      setCurrentAdmins([]);
      const sorted = await firestoreSortByKey(
        CollectionNames.ADMIN,
        "role",
        "asc"
      );
      sorted.map(({ ...rest }) => {
        const location_access = admins.find(
          ({ id }) => id == rest.id
        )?.location_access;
        sortedAdmins.push({ ...rest, location_access });
      });
      setCurrentAdmins([...sortedAdmins]);
    }
    setFilterAnchorEl(null);
  };

  const handleAdminDetailsModalOpen = (item) => {
    setSelectedAdmin(item);
    setAdminDetailsModal(true);
  };

  const handleAdminDetailsModalClose = () => {
    setAdminDetailsModal(false);
    setSelectedAdmin(null);
  };

  const onEdit = () => {
    const row = Object.assign({}, selectedAdmin);
    setAdminDetailsModal(false);
    setSelectedAdmin(null);
    history.push({
      pathname: ROUTES.DASHBOARD_VIEW_ADMIN,
      state: { admin: row },
    });
  };

  const onDelete = () => {
    setAdminDetailsModal(false);
    setDeleteMemberModal(true);
  };

  const onDeleteAdminConfirm = async () => {
    await deleteAdmin(selectedAdmin.id);
    handleDeleteAdmin(selectedAdmin.id);
    setDeleteMemberModal(false);
    setSelectedAdmin(null);
    setDeleteMemberModal(false);
  };

  return (
    <Paper className={classes.paper}>
      <EnhancedTableToolbar
        count={currentAdmins.length}
        classes={classes}
        filterAnchorEl={filterAnchorEl}
        handleFilterClick={handleFilterClick}
        handleFilterClose={handleFilterClose}
      />
      <TableContainer>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell className={classes.headerTitle}>
                Name
              </StyledTableCell>
              <StyledTableCell align="left" className={classes.headerTitle}>
                Phone number
              </StyledTableCell>
              <StyledTableCell align="left" className={classes.headerTitle}>
                Role
              </StyledTableCell>
              <StyledTableCell align="left" className={classes.headerTitle}>
                Access
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAdmins &&
              currentAdmins.map((row, index) => (
                <Fragment>
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.restName}
                      onClick={() => handleAdminDetailsModalOpen(row)}
                    >
                      <Grid container display="flex" alignItems="center">
                        <Avatar
                          src={row.photo_url}
                          style={{ marginRight: 20 }}
                        />
                        <Grid item>
                          <Grid item container direction="column">
                            <Typography
                              style={{
                                fontFamily: "Avenir",
                                fontStyle: "normal",
                                fontWeight: 700,
                                color: "#353535",
                                fontSize: 16,
                              }}
                            >
                              {String(row.first_name + " " + row.last_name)
                                .length > 18
                                ? String(
                                    row.first_name + " " + row.last_name
                                  ).substring(0, 18) + "..."
                                : String(row.first_name + " " + row.last_name)}
                            </Typography>
                            <Typography
                              style={{
                                fontFamily: "Avenir",
                                fontStyle: "normal",
                                fontWeight: 700,
                                color: "#727272",
                                fontSize: 16,
                              }}
                            >
                              {row.email}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.subName}
                      align="left"
                      component={Link}
                      to={{
                        pathname: ROUTES.DASHBOARD_VIEW_ADMIN,
                        state: { admin: row },
                      }}
                    >
                      {formattedPhoneNumber(row.phone_number)}
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.subName}
                      align="left"
                      component={Link}
                      to={{
                        pathname: ROUTES.DASHBOARD_VIEW_ADMIN,
                        state: { admin: row },
                      }}
                    >
                      {row.role.replace(/_/g, " ")}
                    </StyledTableCell>
                    <StyledTableCell
                      className={(classes.subName, classes.rightBorderRadius)}
                      align="left"
                      component={Link}
                      style={{ textDecoration: "none" }}
                      to={{
                        pathname: ROUTES.DASHBOARD_VIEW_ADMIN,
                        state: { admin: row },
                      }}
                    >
                      {row.role === USER_ROLES.ADMIN ? (
                        <Chip
                          label={"All Locations"}
                          className={classes.chip}
                        />
                      ) : (
                        row.location_access &&
                        row.location_access.map((el, i) => (
                          <Chip
                            key={i.toString()}
                            label={el?.name}
                            className={classes.chip}
                          />
                        ))
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                  <div style={{ padding: 10 }} />
                </Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedAdmin && (
        <AdminDetailsModal
          adminDetailsModal={adminDetailsModal}
          handleAdminDetailsModalClose={handleAdminDetailsModalClose}
          onEditClick={onEdit}
          onDeleteClick={onDelete}
          adminDetails={selectedAdmin}
        />
      )}
      <AlertModal
        modalVisible={deleteMemberModal}
        handleClose={() => setDeleteMemberModal(false)}
        description="Are you sure you want to delete this admin?"
        onConfirmClick={onDeleteAdminConfirm}
      />
    </Paper>
  );
}
