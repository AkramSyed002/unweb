import React, { Fragment, useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
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
  Avatar,
} from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'
import PersonIcon from '@material-ui/icons/Person'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

import confirmedCard4 from '../../../assets/images/confirmedCard4.png'
import confirmedCard3 from '../../../assets/images/confirmedCard3.png'
import pendingCard3 from '../../../assets/images/pendingCard3.png'
import CancelledBookingDetailsModal from '../modals/CancelledBookingDetailsModal'
import moment from 'moment'
import { convertToDateString } from '../../../utils/utils'
import { useAppContext } from '../../../context/AppContext'
import { deleteBooking, updateBooking } from '../../../firebase/services'

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: '#C0C0C0',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'Avenir',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: '0px 4px 32px rgba(0, 0, 0, 0.08)',
  },
}))(TableRow)

function createData(avatar, name, day, time, phone, partySize, email, request) {
  return { avatar, name, day, time, phone, partySize, email, request }
}

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
        {title}{' '}
        <span style={{ color: '#C0C0C0', marginLeft: 16 }}>{count}</span>
      </Typography>
      <IconButton
        aria-label="filter list"
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: 'transparent' }}
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
  )
}

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
      <Typography className={classes.subName}>SORT BY</Typography>
      <MenuItem className={classes.filterItem} onClick={handleFilterClose}>
        Alphabetical
      </MenuItem>
      <MenuItem className={classes.filterItem} onClick={handleFilterClose}>
        Date of Reservation
      </MenuItem>
      <MenuItem className={classes.filterItem} onClick={handleFilterClose}>
        Time of reservation
      </MenuItem>
      <MenuItem className={classes.filterItem} onClick={handleFilterClose}>
        Party Size
      </MenuItem>
      <Divider light />
      <Typography className={classes.subName}>FILTER</Typography>
      <FormControl component="fieldset">
        <FormGroup aria-label="position" column>
          <RenderCheckBox
            classes={classes}
            label="Show special requests"
            cName="Show special requests"
          />
        </FormGroup>
      </FormControl>
    </Grid>
  </Menu>
)

const RenderCheckBox = ({ classes, label, cName }) => (
  <Grid item container style={{ marginBottom: 5 }}>
    <Typography className={classes.filterLabel}>{label}</Typography>
    <Checkbox color="primary" name={cName} className={classes.filterCheckbox} />
  </Grid>
)

const useStyles = makeStyles((theme) => ({
  paper: {
    background: '#F8F8F8',
    padding: 16,
    paddingBottom: 32,
    marginBottom: 16,
    marginTop: 32,
  },
  table: {
    minWidth: 700,
    // backgroundColor: theme.palette.action.hover,
    background: '#F8F8F8',
  },
  title: {
    flex: '1 1 100%',
    fontFamily: 'Avenir',
    fontSize: 25,
    fontWeight: 700,
    marginLeft: -10,
  },
  restName: {
    color: '#353535',
    fontWeight: 700,
    fontSize: 16,
    borderRadius: '8px 0px 0px 8px',
    border: 'none',
  },
  subName: {
    color: '#727272',
    fontWeight: 500,
    fontSize: 16,
    fontFamily: 'Avenir',
    fontStyle: 'normal',
    border: 'none',
  },
  rightBorderRadius: {
    borderRadius: '0px 8px 8px 0px',
    border: 'none',
  },
  filterItem: {
    fontWeight: 500,
    fontSize: 16,
    marginLeft: -16,
  },
  headerTitle: {
    backgroundColor: '#F8F8F8',
    fontWeight: 500,
    fontSize: 13,
    textTransform: 'none',
    border: 'none',
  },
  filterIcon: {
    border: '#C0C0C0 solid 1px',
    borderRadius: 4,
    color: '#C0C0C0',
  },
  deleteSelectedButton: {
    textTransform: 'capitalize',
    color: '#FF8888',
    fontWeight: 700,
    fontSize: 16,
    '&:hover': {
      background: 'none',
    },
  },
  filterTitle: {
    color: '#727272',
    fontWeight: 500,
    fontSize: 16,
    fontFamily: 'Avenir',
    fontStyle: 'normal',
    border: 'none',
  },
  filterLabel: {
    width: '70%',
    fontSize: 16,
    fontWeight: 500,
    color: '#353535',
  },
  filterCheckbox: {
    width: '15%',
    marginLeft: 'auto',
    marginTop: -10,
  },
  filterMenu: {
    marginTop: '5em',
    marginLeft: -80,
    borderRadius: 8,
  },
}))

export default function CancellationTab({ title, count, allBookings }) {
  const classes = useStyles()

  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const { bookings, setBookings } = useAppContext()

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const onDeleteRecord = async () => {
    try {
      await deleteBooking(selectedRecord.id)
      const temp = [...bookings]
      const index = temp.findIndex((el) => el.id === selectedRecord.id)
      temp.splice(index, 1)
      setBookings(temp)
      setSelectedRecord(null)
    } catch (error) {
      console.log('Error updating status', error.message)
    }
  }

  const onEditRecord = async (booking) => {
    try {
      booking.last_updated_at = new Date()
      await updateBooking(booking)
      const temp = [...bookings]
      const index = temp.findIndex((el) => el.id === selectedRecord.id)
      temp[index] = booking
      setBookings(temp)
      setSelectedRecord(null)
    } catch (error) {
      console.log('error updating booking', error.message)
    }
  }

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          title={title}
          count={count}
          classes={classes}
          filterAnchorEl={filterAnchorEl}
          handleFilterClick={handleFilterClick}
          handleFilterClose={handleFilterClose}
        />
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.headerTitle}>
                  Name
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Date
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Time
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Phone Number
                </StyledTableCell>
                <StyledTableCell align="left" className={classes.headerTitle}>
                  Party Size
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  className={classes.headerTitle}
                ></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allBookings &&
                allBookings.map((row, index) => (
                  <Fragment>
                    <StyledTableRow
                      key={index}
                      onClick={() => setSelectedRecord(row)}
                      style={{ cursor: 'pointer' }}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                        className={classes.restName}
                      >
                        <Grid item container>
                          <Avatar src={row.user_avatar} />
                          <span style={{ marginLeft: 15, marginTop: 10 }}>
                            {row.user_name}
                          </span>
                        </Grid>
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {moment(
                          convertToDateString(row.booking_timestamp),
                        ).format('ddd MMM DD, YYYY')}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ width: 150 }}
                        className={classes.subName}
                      >
                        <QueryBuilderIcon
                          style={{ marginBottom: -7, marginRight: 5 }}
                        />
                        {moment(
                          convertToDateString(row.booking_timestamp),
                        ).format('hh:mm A')}
                      </StyledTableCell>
                      <StyledTableCell className={classes.subName}>
                        {row.user_phone_number}
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
                        {row.special_requirements ? (
                          <InsertDriveFileIcon style={{ color: '#70C78D' }} />
                        ) : null}
                      </StyledTableCell>
                    </StyledTableRow>
                    <div style={{ paddingTop: 16 }} />
                  </Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <CancelledBookingDetailsModal
        record={selectedRecord}
        cancelledBookingDetailsModal={selectedRecord ? true : false}
        handleModalClose={() => setSelectedRecord(null)}
        bookingStatus={title === 'Cancellations' ? 'cancelled' : 'No-show'}
        onDelete={onDeleteRecord}
        onEdit={onEditRecord}
      />
    </Fragment>
  )
}
