import React, { Fragment, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
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
    fontSize: 22,
    fontWeight: 700,
    marginLeft: -10,
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
}));

export default function MenuItemsTable({ menuItemsData, showEdit }) {
  const classes = useStyles();

  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell
              style={{ paddingLeft: 80 }}
              className={classes.headerTitle}
            >
              Name
            </StyledTableCell>
            <StyledTableCell align="left" className={classes.headerTitle}>
              Currency
            </StyledTableCell>
            <StyledTableCell align="left" className={classes.headerTitle}>
              Price
            </StyledTableCell>
            <StyledTableCell align="left" className={classes.headerTitle}>
              Tags
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItemsData &&
            menuItemsData.map((el, i) => (
              <Fragment>
                <StyledTableRow
                  key={el.id}
                  onClick={() => showEdit && setSelectedRecord(el)}
                  style={{ cursor: showEdit && "pointer" }}
                >
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className={classes.restName}
                  >
                    <Grid item container>
                      <MenuIcon className={classes.menuIcon} />
                      {el.item_name}
                    </Grid>
                  </StyledTableCell>
                  <StyledTableCell className={classes.subName}>
                    {el.currency}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: 150 }}
                    className={classes.subName}
                  >
                    {el.price}
                  </StyledTableCell>
                  <StyledTableCell
                    className={(classes.subName, classes.rightBorderRadius)}
                  >
                    {el.tags &&
                      el.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{ color: `rgb(${tag.color})` }}
                        >
                          {tag?.label}
                        </span>
                      ))}
                  </StyledTableCell>
                </StyledTableRow>
                <div style={{ paddingTop: 16 }} />
              </Fragment>
            ))}
        </TableBody>
      </Table>
      <ManageItemModal
        isVisible={selectedRecord ? true : false}
        handleCloseModal={() => setSelectedRecord(null)}
        record={selectedRecord}
        showEdit={showEdit}
      />
    </TableContainer>
  );
}
