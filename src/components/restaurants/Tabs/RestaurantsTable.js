import React, { Fragment, useEffect, useState } from "react";
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
  Menu,
  MenuItem,
  Grid,
  Divider,
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { ROUTES } from "../../../constants/routes";
import {
  firestoreFilterByKey,
  firestoreSortByKey,
} from "../../../firebase/services";
import { CollectionNames } from "../../../constants";
import { filter } from "lodash";

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
    // boxShadow: "0px 7px 9px 2px rgba(0,0,0,0.01)",
  },
}))(TableRow);

const EnhancedTableToolbar = ({
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  handleFeatureFilter,
  handleStatusFilter,
  count = 0,
  featureOptions,
}) => {
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Restaurants
        <a style={{ color: "#C0C0C0", marginLeft: 16, fontFamily: "Avenir", fontWeight: 800 }}>
          {count}
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
                Created At
              </MenuItem>

              <Divider light />
              <Typography className={classes.subName} style={{ marginTop: 5 }}>
                Filter by feature
              </Typography>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" column>
                  {featureOptions &&
                    featureOptions.map((el, i) => (
                      <RenderCheckBox
                        key={i.toString()}
                        classes={classes}
                        label={el}
                        cName={el}
                        onChange={(e) => handleFeatureFilter(e, el)}
                      />
                    ))}

                  <Divider light />
                  <Typography className={classes.subName}>
                    Filter by status
                  </Typography>
                  <RenderCheckBox
                    classes={classes}
                    label="Permanent"
                    cName="permanent"
                    onChange={(e) => handleStatusFilter(e, "permanent")}
                  />
                  <RenderCheckBox
                    classes={classes}
                    label="Seasonal"
                    cName="seasonal"
                    onChange={(e) => handleStatusFilter(e, "seasonal")}
                  />
                  <RenderCheckBox
                    classes={classes}
                    label="Pop Up"
                    cName="popUp"
                    onChange={(e) => handleStatusFilter(e, "popup")}
                  />
                  <RenderCheckBox
                    classes={classes}
                    label="Archived"
                    cName="archived"
                    onChange={(e) => handleStatusFilter(e, "archived")}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Menu>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const RenderCheckBox = ({ classes, label, cName, onChange }) => (
  <Grid item container style={{ marginBottom: 5 }}>
    <Typography className={classes.filterLabel}>{label}</Typography>
    <Checkbox
      color="primary"
      name={cName}
      className={classes.filterCheckbox}
      onChange={onChange}
    />
  </Grid>
);

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
    fontSize: 25,
    fontWeight: 700,
    marginLeft: -10,
  },
  restName: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 18,
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
  },
  rightBorderRadius: {
    borderRadius: "0px 8px 8px 0px",
    border: "none",
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
    color: "#727272",
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
    // textTransform: 'cap',
    border: "none",
    color: "#C0C0C0",
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

export default function RestaurantsTable({ restaurants }) {
  const { featureOptions } = useAppContext();
  const [filterArray, setFilterArray] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [currentRestaurants, setCurrentRestaurants] = useState(null);
  const [loading, setLoading] = useState(false);

  var featureFilter = [];
  var statusFilter = [];

  useEffect(() => {
    setCurrentRestaurants(restaurants);
  }, [restaurants]);

  const classes = useStyles();

  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = async (filter) => {
    if (!filter) return;
    if (filter === "Alphabetical") {
      setCurrentRestaurants(null);
      const sorted = await firestoreSortByKey(
        CollectionNames.RESTAURANTS,
        "name",
        "asc"
      );
      setCurrentRestaurants([...sorted]);
    } else if (filter === "Created At") {
      setCurrentRestaurants(null);
      const sorted = await firestoreSortByKey(
        CollectionNames.RESTAURANTS,
        "created_at",
        "asc"
      );
      setCurrentRestaurants([...sorted]);
    }
    setFilterAnchorEl(null);
  };
  const filterLogic = async () => {
    // console.log(restaurants)
    // console.log("status",statusArray)
    let filterData = [];
    // Filter Logic
    for (let item of filterArray) {
      let tempFeaturesArray = restaurants.filter((resturanData, index) => {
        let check = false;
        for (let v of resturanData["features"]) {
          if (item == v) {
            check = true;
            break;
          }
        }
        return check;
      });
      filterData = filterData.concat(tempFeaturesArray);
    }
    // Status Logic
    // console.log("fd",statusArray.length,filterData)
    let statusData;
    if (statusArray.length == 0) {
      statusData = filterData;
    } else {
      statusData = [];
    }
    let statusFilterData = [];
    if (filterData.length == 0) {
      statusFilterData = restaurants;
    } else {
      statusFilterData = filterData;
    }

    for (let item of statusArray) {
      let tempStatusArray = statusFilterData.filter((resturanData, index) => {
        let check = false;
        for (let v of resturanData["type"]) {
          if (item == v) {
            check = true;
            break;
          }
        }
        return check;
      });
      statusData = statusData.concat(tempStatusArray);
    }

    if (filterArray.length == 0 && statusArray.length == 0) {
      setCurrentRestaurants(restaurants);
    } else {
      setCurrentRestaurants([...new Set(statusData)]);
    }
  };

  const handleFeatureFilter = async (e, value) => {
    // value = value?.charAt(0).toUpperCase() + value.toLowerCase()?.slice(1);
    if (e.target.checked) {
      let temp = filterArray;
      temp.push(value);
      setFilterArray(temp);
    } else {
      let temp = filterArray;
      temp.splice(temp.indexOf(value), 1);
      setFilterArray(temp);
    }
    filterLogic();
  };

  const handleStatusFilter = async (e, value) => {
    if (e.target.checked) {
      let temp = statusArray;
      temp.push(value);
      setStatusArray(temp);
    } else {
      let temp = statusArray;
      temp.splice(temp.indexOf(value), 1);
      setStatusArray(temp);
    }
    filterLogic();
  };

  return (
    <Paper className={classes.paper} elevation={0}>
      <EnhancedTableToolbar
        classes={classes}
        filterAnchorEl={filterAnchorEl}
        handleFilterClick={handleFilterClick}
        handleFilterClose={handleFilterClose}
        count={currentRestaurants && currentRestaurants.length}
        featureOptions={featureOptions}
        handleFeatureFilter={handleFeatureFilter}
        handleStatusFilter={handleStatusFilter}
      />
      <TableContainer>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell className={classes.headerTitle}>
                Name
              </StyledTableCell>
              <StyledTableCell align="left" className={classes.headerTitle}>
                Address
              </StyledTableCell>
              <StyledTableCell align="left" className={classes.headerTitle}>
                Phone number
              </StyledTableCell>
              <StyledTableCell align="left" className={classes.headerTitle}>
                Features
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRestaurants &&
              currentRestaurants.map((row, index) => (
                <Fragment>
                  <div style={{ marginTop: 10 }}></div>
                  <StyledTableRow
                    key={index}
                    component={Link}
                    to={{
                      pathname: ROUTES.DASHBOARD_VIEW_REST,
                      state: { restaurant: row },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.restName}
                    >
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 150 }}
                      className={classes.subName}
                    >
                      {row.address_line_1}
                      <br />
                      {row.address_line_2}
                    </StyledTableCell>
                    <StyledTableCell className={classes.subName}>
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell
                      className={(classes.subName, classes.rightBorderRadius)}
                      align="left"
                    >
                      {row.features &&
                        row.features.map((el, i) => (
                          <Chip
                            key={i.toString()}
                            label={el}
                            className={classes.chip}
                          />
                        ))}
                    </StyledTableCell>
                  </StyledTableRow>
                  <div style={{ padding: 5 }} />
                </Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
