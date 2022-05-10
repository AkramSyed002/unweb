import React, { Fragment, useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import { useAuth } from "../../../../context/AuthContext";
import { USER_ROLES } from "../../../../constants";
import {
  deleteActivityLog,
  getActivityLogByID,
} from "../../../../firebase/services";
import moment from "moment";
import { convertToDateString } from "../../../../utils/utils";
import LoadingModal from "../../modals/LoadingModal";

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
    border: "none",
    borderRadius: 16,
  },
}))(TableRow);

const EnhancedTableToolbar = ({
  classes,
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
        Activity Log
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
      </IconButton>
    </Toolbar>
  );
};

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

export default function ActivityLogTab({ member }) {
  const classes = useStyles();

  const { currentUser } = useAuth();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectLog, setSelectLog] = useState(false);
  const [activityLogs, setActivityLogs] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  useEffect(() => {
    getActivityLog();
  }, []);

  const getActivityLog = async () => {
    const logs = await getActivityLogByID(member.id);
    setActivityLogs(logs);
  };

  const onDeleteLogs = async () => {
    setLoading(true);
    try {
      await deleteActivityLog(member.id, selectedLogs);
      let temp = [...activityLogs];
      temp.forEach((el, index) => {
        if (selectedLogs.includes(el.notificationId)) {
          temp.splice(index, 1);
        }
      });
      setActivityLogs(temp);
      setSelectLog(false);
      setSelectedLogs([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onSelectLog = (id) => {
    let temp = [...selectedLogs];
    if (temp.includes(id)) temp = temp.filter((e) => e !== id);
    else temp.push(id);
    setSelectedLogs(temp);
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
          count={activityLogs?.length}
        />
        <TableContainer>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.headerTitle}>
                  Day
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Time
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Activity
                </StyledTableCell>
                <StyledTableCell align="right" className={classes.headerTitle}>
                  {selectLog ? (
                    <Button
                      disabled={selectedLogs.length < 1}
                      variant="text"
                      className={classes.deleteSelectedButton}
                      onClick={onDeleteLogs}
                    >
                      Delete selected
                    </Button>
                  ) : undefined}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityLogs &&
                activityLogs.map((row, index) => (
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
                        {moment(convertToDateString(row.created_at)).format(
                          "dddd MMM DD, YYYY"
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ width: 180 }}
                        className={classes.subName}
                      >
                        <QueryBuilderIcon
                          style={{ marginBottom: -7, marginRight: 5 }}
                        />
                        {moment(convertToDateString(row.created_at)).format(
                          "hh:mm A"
                        )}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {`${row.user_name} ${row.description}`}
                      </StyledTableCell>
                      <StyledTableCell
                        className={(classes.subName, classes.rightBorderRadius)}
                        align="right"
                      >
                        {selectLog ? (
                          <Checkbox
                            onChange={({ target }) =>
                              onSelectLog(row.notificationId)
                            }
                            color="primary"
                          />
                        ) : undefined}
                      </StyledTableCell>
                    </StyledTableRow>
                    <div style={{ paddingTop: 18 }} />
                  </Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <LoadingModal modalVisible={loading} />
      {/* <Grid>
        <Button disableElevation variant="text" className={classes.exportCSVButton}>
          Export .CSV
        </Button>
      </Grid> */}
    </Fragment>
  );
}
