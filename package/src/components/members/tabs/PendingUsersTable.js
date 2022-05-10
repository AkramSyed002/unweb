import React, { Fragment, useState, useEffect } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
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
  FormControlLabel,
  Button,
} from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import { Link } from 'react-router-dom'

import memberProfile from '../../../assets/images/memberProfile.png'
import { useAppContext } from '../../../context/AppContext'
import { getArrayByStatus } from '../../../utils/utils'
import { firestoreSortByKey } from '../../../firebase/services'
import { MEMBER_STATUS_OPTIONS, CollectionNames } from '../../../constants'

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
    height: 72,
    boxShadow: '0px -3px 50px -13px rgba(0,0,0,0.05)',
    margin: 10
  },
}))(TableRow)

function createData(firstName, lastName, username, role, phone, tags) {
  return { firstName, lastName, username, role, phone, tags }
}

const rows = [
  createData(
    'Afolabi',
    'David',
    'davida@gmail.com',
    'Super Admin',
    '+1 (818) 123 4567',
    ['Allergy', 'Intolerance', 'Wheelchair Access'],
  ),
  createData(
    'Samuel',
    'Olukoju',
    'samolu@gmail.com',
    'Manager',
    '+1 (818) 123 4567',
    ['Lorem Ipsum', 'Lorem Ipsum'],
  ),
  createData(
    'Hellen',
    'Jummy',
    'hellenjum@gmail.com',
    'Sub-Manager',
    '+1 (818) 123 4567',
  ),
  createData(
    'Adeleke',
    'Peter',
    'lisa.w00drow@gmail.com',
    'Basic-User',
    '+1 (818) 123 4567',
    ['Lorem Ipsum'],
  ),
  createData(
    'Lisa',
    'Woodrow',
    'lisa.w00drow@gmail.com',
    'Super-Admin',
    '+1 (818) 123 4567',
    ['Wheelchair Access'],
  ),
  createData(
    'Lisa',
    'Woodrow',
    'lisa.w00drow@gmail.com',
    'Super-Admin',
    '+1 (818) 123 4567',
    ['Lorem Ipsum', 'Lorem Ipsum'],
  ),
  createData(
    'Lisa',
    'Woodrow',
    'lisa.w00drow@gmail.com',
    'Super-Admin',
    '+1 (818) 123 4567',
  ),
  createData(
    'Lisa',
    'Woodrow',
    'lisa.w00drow@gmail.com',
    'Super-Admin',
    '+1 (818) 123 4567',
    ['Allergy', 'Intolerance', 'Visual Impairment'],
  ),
]

const EnhancedTableToolbar = ({
  classes,
  filterAnchorEl,
  handleFilterClose,
  handleFilterClick,
  userCount,
}) => {
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Pending Users{' '}
        <a style={{ color: '#C0C0C0', marginLeft: 16 }}>{userCount}</a>
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
              <Typography
                className={classes.subName}
                style={{ textTransform: 'uppercase' }}
              >
                sort by
              </Typography>
              <MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose('Alphabetical')}
              >
                Alphabetical
              </MenuItem>
              <MenuItem
                className={classes.filterItem}
                onClick={() => handleFilterClose('Email')}
              >
                Email
              </MenuItem>
            </Grid>
          </Menu>
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

const RenderCheckBox = ({ classes, label, cName }) => (
  <Grid item container style={{ marginBottom: 5 }}>
    <Typography className={classes.filterLabel}>{label}</Typography>
    <Checkbox color="primary" name={cName} className={classes.filterCheckbox} />
  </Grid>
)

export default function PendingUsersTable({ pendingMembers }) {
  const classes = useStyles()
  const { members, tagOptions } = useAppContext()

  const [currentMembers, setCurrentMembers] = useState([])
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)

  useEffect(() => setCurrentMembers(pendingMembers), [pendingMembers])

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = async (filter) => {
    if (!filter) return
    if (filter === 'Alphabetical') {
      setCurrentMembers([])
      const sorted = await firestoreSortByKey(
        CollectionNames.USERS,
        'first_name',
        'asc',
      )
      setCurrentMembers([...sorted])
    } else if (filter === 'Email') {
      setCurrentMembers([])
      const sorted = await firestoreSortByKey(
        CollectionNames.USERS,
        'email',
        'asc',
      )
      setCurrentMembers([...sorted])
    }
    setFilterAnchorEl(null)
  }

  return (
    <Fragment>
      <Paper className={classes.paper}>
      <EnhancedTableToolbar
        classes={classes}
        filterAnchorEl={filterAnchorEl}
        handleFilterClick={handleFilterClick}
        handleFilterClose={handleFilterClose}
        userCount={
          getArrayByStatus(currentMembers, MEMBER_STATUS_OPTIONS.PENDING).length
        }
      />
      <TableContainer>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell className={classes.headerTitle}>
                Customer
              </StyledTableCell>
              <StyledTableCell align="center" className={classes.headerTitle}>
                Phone number
              </StyledTableCell>
              <StyledTableCell
                align="left"
                style={{ paddingLeft: 92 }}
                className={classes.headerTitle}
              >
                Tags
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getArrayByStatus(currentMembers, MEMBER_STATUS_OPTIONS.PENDING) &&
              getArrayByStatus(
                currentMembers,
                MEMBER_STATUS_OPTIONS.PENDING,
              ).map((row, index) => (
                <Fragment>
                  <StyledTableRow
                    key={index}
                    component={Link}
                    to={{
                      pathname: '/dashboard/member-profile',
                      state: { user: row },
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.restName}
                      //   onClick={handleAdminDetailsModalOpen}
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
                                fontFamily: 'Avenir',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                color: '#353535',
                                fontSize: 16,
                              }}
                            >
                              {row.first_name + ' ' + row.last_name}
                            </Typography>
                            <Typography
                              style={{
                                fontFamily: 'Avenir',
                                fontStyle: 'normal',
                                color: '#727272',
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
                    <StyledTableCell className={classes.subName} align="center">
                      {row.phone_number}
                    </StyledTableCell>
                    <StyledTableCell
                      className={(classes.subName, classes.rightBorderRadius)}
                      align="left"
                    >
                      {row.tags &&
                        row.tags.map((tag, index) => (
                          <Chip
                            label={tag}
                            key={index}
                            className={classes.chip}
                            style={{
                              background: `rgba(${
                                tagOptions.find(
                                  (option) => option?.label == tag,
                                )?.color
                              },0.1)`,
                              color: `rgb(${
                                tagOptions.find(
                                  (option) => option?.label == tag,
                                )?.color
                              })`,
                            }}
                          />
                        ))}
                    </StyledTableCell>
                  </StyledTableRow>
                  <div style={{ padding: 10 }} />
                </Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
      <Grid>
        <Button variant="text" className={classes.exportCSVButton}>
          Export.CSV
        </Button>
      </Grid>
    </Fragment>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    background: '#F8F8F8',
    boxShadow: 'none',
    borderRadius: 16,
    padding: 16,
    paddingBottom: 32,
    marginBottom: 16,
  },
  table: {
    minWidth: 700,
  },
  title: {
    flex: '1 1 100%',
    fontFamily: 'Avenir',
    fontStyle: 'normal',
    fontSize: 22,
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
    paddingLeft: 92,
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
  },
  filterItem: {
    fontWeight: 500,
    fontSize: 16,
    marginLeft: -16,
    height: 30,
  },
  headerTitle: {
    backgroundColor: '#F8F8F8',
    fontWeight: 500,
    fontSize: 13,
    textTransform: 'uppercase',
    border: 'none',
    fontFamily: 'Avenir',
    fontStyle: 'normal',
  },
  exportCSVButton: {
    height: 32,
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 30,
    color: '#727272',
    // fontFamily: "Avenir",
    fontStyle: 'normal',
  },
  filterIcon: {
    border: '#C0C0C0 solid 1px',
    borderRadius: 4,
    color: '#C0C0C0',
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
    marginTop: -20,
    marginLeft: -80,
    borderRadius: 8,
  },
}))
