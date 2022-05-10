import React, { Fragment, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Grid,
  Divider,
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Button,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { useAuth } from "../../../../context/AuthContext";
import { USER_ROLES } from "../../../../constants";

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
    boxShadow: "0px -3px 50px -13px rgba(0,0,0,0.05)",
    border: "none",
    borderRadius: 16,
  },
}))(TableRow);

function createData(day, time, activity) {
  return { day, time, activity };
}

const rows = [
  createData(
    "Mon Jan 3, 2021",
    "7: 00 to 8:00 PM",
    "Zie Chene updated her preferred greeting."
  ),
  createData(
    "Tue Jan 4, 2021",
    "7: 00 to 8:00 PM",
    "Zie Chene opted out of all SMS notifications."
  ),
  createData(
    "Wed Jan 5, 2021",
    "7: 00 to 8:00 PM",
    "Zie Chene updated her last name."
  ),
];

const EnhancedTableToolbar = ({
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  selectLog,
  setSelectLog,
  currentUser,
}) => {
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Activity Log{" "}
        <a
          style={{
            color: "#C0C0C0",
            marginLeft: 16,
            fontFamily: "Avenir",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          3
        </a>
      </Typography>
      <IconButton
        aria-label="filter list"
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent" }}
      >
        {currentUser.role === USER_ROLES.ADMIN && (
          <Typography
            color="primary"
            style={{
              marginRight: 10,
              cursor: "pointer",
              fontFamily: "Avenir",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: 16,
            }}
            onClick={() => setSelectLog(!selectLog)}
          >
            {selectLog ? "Done" : "Select"}
          </Typography>
        )}
        <Tooltip title="Filter list">
          <FilterListIcon
            aria-controls="filterMenu"
            aria-haspopup="true"
            onClick={handleFilterClick}
            className={classes.filterIcon}
          />
        </Tooltip>
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
            <Typography className={classes.subName}>SORT BY</Typography>
            <MenuItem
              className={classes.filterItem}
              onClick={handleFilterClose}
            >
              Date of Reservation
            </MenuItem>
            <MenuItem
              className={classes.filterItem}
              onClick={handleFilterClose}
            >
              Date Created
            </MenuItem>
            <MenuItem
              className={classes.filterItem}
              onClick={handleFilterClose}
            >
              Location
            </MenuItem>
            <Divider light />
            <Typography className={classes.subName}>FILTER</Typography>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" column>
                <RenderCheckBox
                  classes={classes}
                  label="Cancellations"
                  cName="cancellations"
                />
                <RenderCheckBox
                  classes={classes}
                  label="No-shows"
                  cName="no-shows"
                />
                <RenderCheckBox
                  classes={classes}
                  label="Completed Bookings"
                  cName="completedBookings"
                />
                <RenderCheckBox
                  classes={classes}
                  label="Special Requests"
                  cName="specialRequests"
                />
                <RenderCheckBox
                  classes={classes}
                  label="Declined bookings"
                  cName="declinedBookings"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Menu>
      </IconButton>
    </Toolbar>
  );
};

const RenderCheckBox = ({ classes, label, cName }) => (
  <Grid item container style={{ marginBottom: 5 }}>
    <Typography className={classes.filterLabel}>{label}</Typography>
    <Checkbox color="primary" name={cName} className={classes.filterCheckbox} />
  </Grid>
);

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "#F8F8F8",
    boxShadow: "none",
    borderRadius: 16,
    padding: 16,
    paddingBottom: 32,
    marginBottom: 16,
  },
  table: {
    minWidth: 700,
  },
  title: {
    flex: "1 1 100%",
    fontFamily: "Avenir",
    fontSize: 22,
    fontWeight: 700,
    marginLeft: -10,

    fontStyle: "normal",
  },
  restName: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: "8px 0px 0px 8px",
    border: "none",
  },
  subName: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    border: "none",
  },
  rightBorderRadius: {
    borderRadius: "0px 8px 8px 0px",
    border: "none",
  },
  filterItem: {
    fontWeight: 500,
    fontSize: 16,
    marginLeft: -16,
  },
  headerTitle: {
    backgroundColor: "#F8F8F8",
    fontWeight: 500,
    fontSize: 13,
    textTransform: "none",
    border: "none",
  },
  exportCSVButton: {
    color: "#C0C0C0",
    height: 32,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 30,
  },
  deleteSelectedButton: {
    textTransform: "capitalize",
    color: "#FF8888",
    fontWeight: 700,
    fontSize: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    "&:hover": {
      background: "none",
    },
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

export default function ActivityLogTab() {
  const classes = useStyles();

  const { currentUser } = useAuth();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectLog, setSelectLog] = useState(false);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          classes={classes}
          filterAnchorEl={filterAnchorEl}
          handleFilterClick={handleFilterClick}
          handleFilterClose={handleFilterClose}
          selectLog={selectLog}
          setSelectLog={setSelectLog}
          currentUser={currentUser}
        />
        <TableContainer>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.headerTitle}>
                  DAY
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  TIME
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  ACTIVITY
                </StyledTableCell>
                <StyledTableCell align="right" className={classes.headerTitle}>
                  {selectLog ? (
                    <Button
                      variant="text"
                      className={classes.deleteSelectedButton}
                    >
                      Delete Selected
                    </Button>
                  ) : undefined}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <Fragment>
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.subName}
                      style={{
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      }}
                    >
                      {row.day}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 180 }}
                      className={classes.subName}
                    >
                      <QueryBuilderIcon
                        style={{ marginBottom: -7, marginRight: 5 }}
                      />
                      {row.time}
                    </StyledTableCell>
                    <StyledTableCell className={classes.subName}>
                      {row.activity}
                    </StyledTableCell>
                    <StyledTableCell
                      className={(classes.subName, classes.rightBorderRadius)}
                      align="right"
                    >
                      {selectLog ? <Checkbox color="primary" /> : undefined}
                    </StyledTableCell>
                  </StyledTableRow>
                  <div style={{ paddingTop: 18 }} />
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Grid>
        <Button variant="text" className={classes.exportCSVButton}>
          Export .CSV
        </Button>
      </Grid>
    </Fragment>
  );
}
