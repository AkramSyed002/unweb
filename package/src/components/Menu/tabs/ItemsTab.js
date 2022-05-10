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
} from "@material-ui/core";

import FilterListIcon from "@material-ui/icons/FilterList";

import { ItemsData } from "../../../constants";
import EditItemModal from "../modals/EditItemModal";
import { useAppContext } from "../../../context/AppContext";
import ManageItemModal from "../modals/ManageItemModal";

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
    boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.08)",
  },
}))(TableRow);

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
    background: "#F8F8F8",
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
    textTransform: "uppercase",
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
}) => {
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
        />
      </IconButton>
    </Toolbar>
  );
};

const RenderFilterMenu = ({ classes, handleFilterClose, filterAnchorEl }) => (
  <Menu
    id="filterMenu"
    anchorEl={filterAnchorEl}
    keepMounted
    open={Boolean(filterAnchorEl)}
    onClose={handleFilterClose}
    elevation={2}
    className={classes.filterMenu}
  >
    <Grid container direction="column" style={{ width: 282, padding: 16 }}>
      <Typography className={classes.restName}>FILTER BY</Typography>
      <Typography className={classes.subName}>CATEGORY</Typography>
      <FormControl component="fieldset">
        <FormGroup aria-label="position" column>
          <RenderCheckBox
            classes={classes}
            label="category 1"
            cName="category 1"
          />
          <RenderCheckBox
            classes={classes}
            label="category 2"
            cName="category 2"
          />
          <RenderCheckBox
            classes={classes}
            label="category 3"
            cName="category 3"
          />
          <Divider light />
          <Typography className={classes.subName}>SUB-HEADING</Typography>
          <RenderCheckBox classes={classes} label="Sub 1" cName="Sub 1" />
          <RenderCheckBox classes={classes} label="Sub 2" cName="Sub 2" />
          <RenderCheckBox classes={classes} label="Sub 3" cName="Sub 3" />
          <Divider light />
          <Typography className={classes.subName}>TAG</Typography>
          <RenderCheckBox classes={classes} label="Vegan" cName="Vegan" />
          <RenderCheckBox
            classes={classes}
            label="Nut Allergy"
            cName="Nut Allergy"
          />
          <RenderCheckBox classes={classes} label="Tag 3" cName="Tag 3" />
        </FormGroup>
      </FormControl>
    </Grid>
  </Menu>
);

const RenderCheckBox = ({ classes, label, cName }) => (
  <Grid item container style={{ marginBottom: 5 }}>
    <Typography className={classes.filterLabel}>{label}</Typography>
    <Checkbox color="primary" name={cName} className={classes.filterCheckbox} />
  </Grid>
);

export default function ItemsTab({ showEdit }) {
  const classes = useStyles();

  const { menuItems } = useAppContext();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
          title="All Items"
          count={menuItems.length}
          classes={classes}
          filterAnchorEl={filterAnchorEl}
          handleFilterClick={handleFilterClick}
          handleFilterClose={handleFilterClose}
        />
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ paddingLeft: 80 }}
                  className={classes.headerTitle}
                >
                  Name
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Price
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Category
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Sub-Name
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Tags
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems &&
                menuItems.map((row, index) => (
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
      <ManageItemModal
        isVisible={selectedRecord ? true : false}
        handleCloseModal={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </Fragment>
  );
}
