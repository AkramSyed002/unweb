import React, { Fragment, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
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
  Divider,
  FormControl,
  FormGroup,
  Checkbox,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Link } from "react-router-dom";

import memberProfile from "../../../assets/images/memberProfile.png";
import { useAppContext } from "../../../context/AppContext";
import {
  formattedDate,
  formattedDateForCVS,
  getArrayByStatus,
} from "../../../utils/utils";
import {
  firestoreSortByKey,
  firestoreFilterByKey,
} from "../../../firebase/services";
import { MEMBER_STATUS_OPTIONS, CollectionNames } from "../../../constants";

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
    height: 72,
    // boxShadow: "0px -3px 50px -13px rgba(0,0,0,0.05)",
    margin: 10,
  },
}))(TableRow);

export default function ActiveUsersTable({ activeMembers }) {
  const classes = useStyles();
  const { tagOptions } = useAppContext();
  const [currentMembers, setCurrentMembers] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [checkBoxesFields, setCheckBoxesFields] = useState([
    { label: "Phone number", value: true },
    { label: "Tags", value: true },
    { label: "Creation date" },
    { label: "Date of birth", value: true },
    { label: "Address", value: false },
    { label: "Home location", value: false },
    { label: "Global locations", value: false },
  ]);

  useEffect(() => setCurrentMembers(activeMembers), [activeMembers]);
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = async (filter) => {
    if (!filter) return;
    if (filter === "Alphabetical") {
      setCurrentMembers([]);
      const sorted = await firestoreSortByKey(
        CollectionNames.USERS,
        "first_name",
        "asc"
      );
      setCurrentMembers([...sorted]);
    } else if (filter === "Created At") {
      setCurrentMembers([]);
      const sorted = await firestoreSortByKey(
        CollectionNames.USERS,
        "created_at",
        "asc"
      );
      // setCurrentMembers([]);
      // return console.log(sorted);
      setCurrentMembers([...sorted]);
    } else if (filter === "DOB") {
      setCurrentMembers([]);
      const sorted = await firestoreSortByKey(
        CollectionNames.USERS,
        "date_of_birth",
        "asc"
      );
      setCurrentMembers([...sorted]);
    }
    setFilterAnchorEl(null);
  };

  const handleCheckBox = (index) => {
    const temp = [...checkBoxesFields];
    temp[index].value = !temp[index].value;
    setCheckBoxesFields(temp);
  };

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          classes={classes}
          filterAnchorEl={filterAnchorEl}
          handleFilterClick={handleFilterClick}
          handleFilterClose={handleFilterClose}
          handleCheckBox={handleCheckBox}
          userCount={
            getArrayByStatus(currentMembers, MEMBER_STATUS_OPTIONS.LIVE).length
          }
          options={checkBoxesFields}
        />
        <TableContainer>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.headerTitle}>
                  Members
                </StyledTableCell>
                {checkBoxesFields[0].value && (
                  <StyledTableCell
                    align="center"
                    className={classes.headerTitle}
                  >
                    Phone number
                  </StyledTableCell>
                )}

                {checkBoxesFields[1].value && (
                  <StyledTableCell
                    align="left"
                    style={{ paddingLeft: 92 }}
                    className={classes.headerTitle}
                  >
                    Tags
                  </StyledTableCell>
                )}

                {checkBoxesFields[2].value && (
                  <StyledTableCell
                    align="left"
                    style={{ paddingLeft: 92 }}
                    className={classes.headerTitle}
                  >
                    Creation date
                  </StyledTableCell>
                )}

                {checkBoxesFields[3].value && (
                  <StyledTableCell
                    align="left"
                    // style={{ paddingLeft: 92 }}
                    className={classes.headerTitle}
                  >
                    Date of birth
                  </StyledTableCell>
                )}
                {checkBoxesFields[4].value && (
                  <StyledTableCell
                    align="left"
                    // style={{ paddingLeft: 92 }}
                    className={classes.headerTitle}
                  >
                    Address
                  </StyledTableCell>
                )}
                {checkBoxesFields[5].value && (
                  <StyledTableCell
                    align="left"
                    // style={{ paddingLeft: 92 }}
                    className={classes.headerTitle}
                  >
                    Home location
                  </StyledTableCell>
                )}
                {checkBoxesFields[6].value && (
                  <StyledTableCell
                    align="left"
                    style={{ paddingLeft: 92 }}
                    className={classes.headerTitle}
                  >
                    Global location
                  </StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {getArrayByStatus(currentMembers, MEMBER_STATUS_OPTIONS.LIVE) &&
                getArrayByStatus(
                  currentMembers,
                  MEMBER_STATUS_OPTIONS.LIVE
                ).map((row, index) => (
                  <Fragment>
                    <StyledTableRow
                      key={index}
                      component={Link}
                      to={{
                        pathname: "/dashboard/member-profile",
                        state: { user: row },
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                        className={classes.restName}
                      >
                        <Grid container>
                          <Avatar
                            src={
                              row.profile_image_URL
                                ? row.profile_image_URL
                                : memberProfile
                            }
                            style={{ marginRight: 25 }}
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
                                {row.first_name + " " + row.last_name}
                              </Typography>
                              <Typography
                                style={{
                                  color: "#727272",
                                  fontFamily: "Avenir",
                                  fontStyle: "normal",
                                  fontWeight: 500,
                                  fontSize: 13,
                                }}
                              >
                                {row.email}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                      {checkBoxesFields[0].value && (
                        <StyledTableCell
                          className={classes.subName}
                          align="center"
                        >
                          {row.phone_number}
                        </StyledTableCell>
                      )}
                      {checkBoxesFields[1].value && (
                        <StyledTableCell
                          className={classes.subName}
                          // classes.rightBorderRadius
                          align="left"
                        >
                          {row.tags &&
                            row.tags.map((tag, index) => (
                              <Chip
                                label={tag}
                                key={index}
                                className={classes.chip}
                                style={{
                                  marginTop: 5,
                                  background: `rgba(${
                                    tagOptions.find(
                                      (option) => option?.label == tag
                                    )?.color
                                  },0.1)`,
                                  color: `rgb(${
                                    tagOptions.find(
                                      (option) => option?.label == tag
                                    )?.color
                                  })`,
                                }}
                              />
                            ))}
                        </StyledTableCell>
                      )}

                      {/* test  */}
                      {checkBoxesFields[2].value && (
                        <StyledTableCell align="center">
                          {row.created_at}
                        </StyledTableCell>
                      )}

                      {checkBoxesFields[3].value && (
                        <StyledTableCell>{row.date_of_birth}</StyledTableCell>
                      )}
                      {checkBoxesFields[4].value && (
                        <StyledTableCell>
                          {`${row?.address_1} ${row?.address_2} ${row.city}`}
                        </StyledTableCell>
                      )}
                      {checkBoxesFields[5].value && (
                        <StyledTableCell>{row.home_restaurant}</StyledTableCell>
                      )}
                      {checkBoxesFields[6].value && (
                        <StyledTableCell
                          className={
                            (classes.subName, classes.rightBorderRadius)
                          }
                          align="left"
                        >
                          {/* {row.global_locations.map(el => `${el}, `)} */}
                          {row.global_locations &&
                            row.global_locations.map(
                              (global_locations, index) => (
                                <Chip
                                  label={global_locations}
                                  key={index}
                                  className={classes.chip}
                                  style={{ marginTop: 5 }}
                                />
                              )
                            )}
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                    <div style={{ padding: 10 }} />
                  </Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* <Grid>
        <Button disableElevation variant="text" className={classes.exportCSVButton}>
          Export .CSV
        </Button>
      </Grid> */}
    </Fragment>
  );
}

const EnhancedTableToolbar = ({
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  handleCheckBox,
  userCount,
  options,
}) => {
  const [checkedCounter, setCheckedCounter] = useState(0);

  useEffect(() => {
    setCheckedCounter(options.filter((el) => el.value === true).length);
  }, []);

  const handleChangeCheckbox = (i, v) => {
    let temp = checkedCounter;
    if (v) temp++;
    else temp--;
    setCheckedCounter(temp);
    handleCheckBox(i);
  };
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Active members
        <a
          style={{
            color: "#C0C0C0",
            marginLeft: 16,
            fontFamily: "Avenir",
            fontstyle: "normal",
            fontWeight: 800,
            fontsize: 22,
          }}
        >
          {userCount}
        </a>
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
              <MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose("Created At")}
              >
                Creation date
              </MenuItem>
              <MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose("DOB")}
              >
                Date of birth
              </MenuItem>
              <Divider light />
              <Typography className={classes.subName} style={{ marginTop: 5 }}>
                Show by feature (Max 4)
              </Typography>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" column>
                  {options.map((el, i) => (
                    <RenderCheckBox
                      key={i.toString()}
                      classes={classes}
                      label={el.label}
                      cName={el.label}
                      value={el.value}
                      onChange={(value) => handleChangeCheckbox(i, value)}
                      disable={checkedCounter > 3 && el.value === false}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Menu>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const RenderCheckBox = ({
  classes,
  label,
  cName,
  onChange,
  value,
  disable,
}) => (
  <Grid item container style={{ marginBottom: 5 }}>
    <Typography className={classes.filterLabel}>{label}</Typography>
    <Checkbox
      defaultChecked={value}
      color="primary"
      name={cName}
      className={classes.filterCheckbox}
      onChange={() => onChange(!value)}
      value={value}
      disabled={disable}
    />
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
    borderBottom: "none",
  },
  title: {
    flex: "1 1 100%",
    fontFamily: "AvenirBold",
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
    paddingLeft: 92,
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "none",
  },
  filterItem: {
    fontWeight: 500,
    fontSize: 16,
    marginLeft: -16,
    height: 30,
  },
  headerTitle: {
    backgroundColor: "#F8F8F8",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
  },
  exportCSVButton: {
    // color: "#C0C0C0",
    height: 32,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 30,
    color: "#727272",
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
    marginTop: -20,
    marginLeft: -80,
    borderRadius: 8,
  },
  MuiTableCell: {
    borderBottom: "none",
  },
}));
