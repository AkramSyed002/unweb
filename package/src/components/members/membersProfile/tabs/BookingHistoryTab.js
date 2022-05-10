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
import PersonIcon from "@material-ui/icons/Person";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import BookingDetailsModal from "../../modals/BookingDetailsModal";
import { useAuth } from "../../../../context/AuthContext";
import { useEffect } from "react";
import { getMemberBookingsById } from "../../../../firebase/services";
import { useLocation } from "react-router";
import moment from "moment";
import { convertToDateString } from "../../../../utils/utils";
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

const EnhancedTableToolbar = ({
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  selectLog,
  setSelectLog,
  currentUser,
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
        History{" "}
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
          {count}
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

export default function BookingHistoryTab() {
  const classes = useStyles();

  const { currentUser } = useAuth();
  const location = useLocation();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [bookingDetailsModal, setBookingDetailsModal] = useState(false);
  const [selectLog, setSelectLog] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState({
    created_at: "",
  });

  useEffect(() => {
    const getMemberBookings = async () => {
      let temp = [];
      const snapshot = await getMemberBookingsById(location.state.user.id);
      snapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      setBookings(temp);
    };
    getMemberBookings();
  }, []);

  const handleBookingDetailsModalOpen = (index) => {
    setSelectedBooking(bookings[index]);
    setBookingDetailsModal(true);
  };
  const handleBookingDetailsModalClose = () => {
    setBookingDetailsModal(false);
    setSelectedBooking({ created_at: "" });
  };

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
          count={bookings.length}
          currentUser={currentUser}
        />
        <TableContainer>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.headerTitle}>
                  DATE
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  TIME
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  LOCATION
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  PARTY SIZE
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
            {bookings.length > 1 && (
              <TableBody>
                {bookings.map((row, index) => (
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
                        {/* "Sat Jan 1, 2021", */}
                        {moment(
                          convertToDateString(row.booking_timestamp)
                        ).format("ddd MMM DD, YYYY")}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ width: 150 }}
                        className={classes.subName}
                      >
                        <QueryBuilderIcon
                          style={{ marginBottom: -7, marginRight: 5 }}
                        />
                        {moment(
                          convertToDateString(row.booking_timestamp)
                        ).format("hh:mm A")}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {row.restaurant_name}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        <PersonIcon
                          style={{ marginBottom: -7, marginRight: 5 }}
                        />
                        {row.guests}
                      </StyledTableCell>
                      <StyledTableCell
                        className={(classes.subName, classes.rightBorderRadius)}
                        align="right"
                      >
                        <InsertDriveFileIcon
                          style={{ color: "#70C78D", marginBottom: -8 }}
                          onClick={() => handleBookingDetailsModalOpen(index)}
                        />
                        {selectLog ? <Checkbox color="primary" /> : undefined}
                      </StyledTableCell>
                    </StyledTableRow>
                    <div style={{ paddingTop: 18 }} />
                  </Fragment>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
      <Grid>
        <Button variant="text" className={classes.exportCSVButton}>
          Export.CSV
        </Button>
      </Grid>
      <BookingDetailsModal
        bookingDetailsModal={bookingDetailsModal}
        handleBookingDetailsModalClose={handleBookingDetailsModalClose}
        booking={selectedBooking}
      />
    </Fragment>
  );
}
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
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  exportCSVButton: {
    color: "#C0C0C0",
    height: 32,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 30,
  },
  filterIcon: {
    border: "#C0C0C0 solid 1px",
    borderRadius: 4,
    color: "#C0C0C0",
  },
  deleteSelectedButton: {
    textTransform: "capitalize",
    color: "#FF8888",
    fontWeight: 700,
    fontSize: 16,
    "&:hover": {
      background: "none",
    },
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
