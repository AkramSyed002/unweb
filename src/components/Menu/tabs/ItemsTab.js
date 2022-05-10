import React, { Fragment, useEffect, useState } from "react";
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
} from "@material-ui/core";

import FilterListIcon from "@material-ui/icons/FilterList";
import { removeDuplicateFromArray } from "../../../utils/utils";

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
    // boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.08)",
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "#F8F8F8",
    padding: 16,
    paddingBottom: 32,
    marginBottom: 16,
    marginTop: 32,
    boxShadow: "none"
  },
  tableContainer: {
    boxShadow: "none"
  },
  table: {
    minWidth: 700,
    background: "#F8F8F8",
    boxShadow: "none",
    elevation: 0,
  },
  title: {
    flex: "1 1 100%",
    fontSize: 25,
    fontWeight: 700,
    marginLeft: -10,
    fontFamily: "Avenir",
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
  headerTitle: {
    backgroundColor: "#F8F8F8",
    fontWeight: 500,
    fontSize: 13,
    border: "none",
  },
  rightBorderRadius: {
    borderRadius: "0px 8px 8px 0px",
    border: "none",
  },
  menuIcon: {
    color: "#727272",
    marginRight: 34,
    // marginTop: 8,
  },
  filterItem: {
    fontWeight: 500,
    fontSize: 16,
    marginLeft: -16,
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
    height: 600,
  },
}));

const EnhancedTableToolbar = ({
  title,
  count,
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  menuItems,
  handleFeatureFilter,
  handleStatusFilter,
}) => {
  // console.log('data upper', menuItems)
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
        <span style={{ color: "#C0C0C0", marginLeft: 16 }}>{count}</span>
      </Typography>
      <IconButton
        aria-label="filter list"
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent" }}
      >
        <Tooltip title="Filter list">
          <FilterListIcon
            aria-controls="filterMenu"
            aria-haspopup="true"
            onClick={handleFilterClick}
            className={classes.filterIcon}
          />
        </Tooltip>
        <RenderFilterMenu
          classes={classes}
          handleFilterClose={handleFilterClose}
          filterAnchorEl={filterAnchorEl}
          menuItems={menuItems}
          handleFeatureFilter={handleFeatureFilter}
          handleStatusFilter={handleStatusFilter}
        />
      </IconButton>
    </Toolbar>
  );
};

const RenderFilterMenu = ({
  classes,
  handleFilterClose,
  filterAnchorEl,
  menuItems,
  handleFeatureFilter,
  handleStatusFilter,
}) => {
  const super_categories = useState(
    removeDuplicateFromArray(menuItems, "super_category")
  )[0];
  const categories = useState(
    removeDuplicateFromArray(menuItems, "category")
  )[0];
  return (
    <Menu
      id="filterMenu"
      anchorEl={filterAnchorEl}
      keepMounted
      open={Boolean(filterAnchorEl)}
      onClose={handleFilterClose}
      elevation={2}
      className={classes.filterMenu}
    >
      {/* {menuItems.map((el) => el.category)} */}
      {/* my work start here */}
      <Grid container direction="column" style={{ width: 282, padding: 16 }}>
        <Typography className={classes.restName}>Filter by </Typography>
        <Typography className={classes.subName}>Category</Typography>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" column>
            {super_categories &&
              super_categories.map((el, index) => (
                <RenderCheckBox
                  key={index.toString()}
                  classes={classes}
                  label={el}
                  cName={el}
                  onChange={(e) => handleFeatureFilter(e, el)}
                />
              ))}
            {/* <RenderCheckBox
            classes={classes}
            label="category 2"
            cName="category 2"
          />
          <RenderCheckBox
            classes={classes}
            label="category 3"
            cName="category 3"
          /> */}
            <Divider light />
            <Typography className={classes.subName}>Sub heading</Typography>
            {categories &&
              categories.map((el, index) => (
                <RenderCheckBox
                  key={index}
                  classes={classes}
                  label={el}
                  cName={el}
                  onChange={(e) => handleStatusFilter(e, el)}
                />
              ))}
            <Divider light />
            {/* <Typography className={classes.subName}>Tag</Typography>
            <RenderCheckBox classes={classes} label="Vegan" cName="Vegan" />
            <RenderCheckBox
              classes={classes}
              label="Nut Allergy"
              cName="Nut Allergy"
            />
            <RenderCheckBox classes={classes} label="Tag 3" cName="Tag 3" /> */}
          </FormGroup>
        </FormControl>
      </Grid>
    </Menu>
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

export default function ItemsTab({ showEdit, menuItems, setSelectedRecord }) {
  // console.log("data in itemsTab", menuItems);
  const classes = useStyles();

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [filterArray, setFilterArray] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [currentMenu, setCurrentMenu] = useState(null);

  useEffect(() => {
    setCurrentMenu(menuItems);
  }, [menuItems]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  //
  const filterLogic = async () => {
    // console.log(restaurants)
    // console.log("status",statusArray)
    let filterData = [];
    // Filter Logic

    for (let item of filterArray) {
      let tempFeaturesArray = menuItems.filter((resturanData, index) => {
        if (item === resturanData["super_category"]) return true;
        return false;
      });
      filterData = filterData.concat(tempFeaturesArray);
    }
    // Status Logic
    // console.log("fd",statusArray.length,filterData)
    let statusData;
    if (statusArray.length === 0) {
      statusData = filterData;
    } else {
      statusData = [];
    }
    let statusFilterData = [];
    if (filterData.length === 0) {
      statusFilterData = menuItems;
    } else {
      statusFilterData = filterData;
    }

    for (let item of statusArray) {
      let tempStatusArray = statusFilterData.filter((resturanData, index) => {
        if (item === resturanData["category"]) return true;
        return false;
      });
      statusData = statusData.concat(tempStatusArray);
    }

    if (filterArray.length == 0 && statusArray.length == 0) {
      setCurrentMenu(menuItems);
    } else {
      setCurrentMenu([...new Set(statusData)]);
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
    console.log(e, value);
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
    <Fragment>
      <Paper className={classes.paper} elevation={0}>
        <EnhancedTableToolbar
          menuItems={menuItems}
          title="All Items"
          count={currentMenu?.length}
          classes={classes}
          filterAnchorEl={filterAnchorEl}
          handleFilterClick={handleFilterClick}
          handleFilterClose={handleFilterClose}
          handleFeatureFilter={handleFeatureFilter}
          handleStatusFilter={handleStatusFilter}
        />
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.headerTitle}>
                  Name
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Price
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Category
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Sub name
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Tags
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMenu &&
                currentMenu.map((row, index) => (
                  <Fragment>
                    <StyledTableRow
                      key={index}
                      onClick={() => showEdit && setSelectedRecord(row)}
                      style={{ cursor: showEdit && "pointer" }}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                        className={classes.restName}
                      >
                        {row.item_name}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {row.currency}
                        {row.price}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {row.super_category}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {row.category}
                      </StyledTableCell>
                      <StyledTableCell
                        className={(classes.subName, classes.rightBorderRadius)}
                      >
                        {row.dietary_options &&
                          row.dietary_options.map((tag, index) => (
                            <span key={index}>{tag}</span>
                          ))}
                      </StyledTableCell>
                    </StyledTableRow>
                    <div style={{ paddingTop: 16 }} />
                  </Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
}
