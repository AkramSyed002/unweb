import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Button,
  Grid,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core'
import { CSVLink } from 'react-csv'

import { useHistory } from 'react-router-dom'
import ActiveUsersTab from './tabs/ActiveUsersTab'
import PendingUsersTab from './tabs/PendingUsersTab'
import CancelledUsersTab from './tabs/CancelledUsersTab'
import { ROUTES } from '../../constants/routes'
import { useAppContext } from '../../context/AppContext'
import { MEMBER_STATUS_OPTIONS, USER_ROLES } from '../../constants'
import { formattedDate, formattedDateForCVS, getArrayByStatus } from '../../utils/utils'
import { useAuth } from '../../context/AuthContext'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

export default function MembersTabs({
  onTabChange,
  activeMembers,
  pendingMembers,
  cancelledMembers,
  allMembers
}) {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const [value, setValue] = useState(0)
  const { members } = useAppContext()
  const { currentUser } = useAuth()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleAdd = () => {
    history.push(ROUTES.MEMBER_ADD)
  }



  // TODO: add header to csv
  let headers = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" }
  ];
  let data = Object.values(allMembers ? allMembers : []);

  data.forEach(el => {
    el.created_at = formattedDateForCVS(el.created_at)
    el.date_of_birth = formattedDateForCVS(el.date_of_birth)
    el.deleted_at = formattedDateForCVS(el.deleted_at)
  });

  const csvReport = {
    filename: 'MembersFormData.csv',
    data,
  }
  return (
    <div className={classes.root}>
      <AppBar position="static" color="#fff" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="none"
          textColor="none"
          className={classes.tabLine}
        >
          <Tab
            label={`Active members ${getArrayByStatus(members, MEMBER_STATUS_OPTIONS.LIVE).length
              }`}
            classes={{
              root: value === 0 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(0)}
            onClick={() => onTabChange('Active members')}
          />
          <Tab
            label={`Pending members ${getArrayByStatus(members, MEMBER_STATUS_OPTIONS.PENDING).length
              }`}
            classes={{
              root: value === 1 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(1)}
            onClick={() => onTabChange('Pending members')}
          />
          <Tab
            label={`Cancelled members ${getArrayByStatus(
              members,
              MEMBER_STATUS_OPTIONS.CANCELLED,
              MEMBER_STATUS_OPTIONS.FROZEN,
              MEMBER_STATUS_OPTIONS.SUSPENDED,
              MEMBER_STATUS_OPTIONS.CANCELLED,
              MEMBER_STATUS_OPTIONS.EXPIRED,
              MEMBER_STATUS_OPTIONS.TERMINATED,
            ).length
              }`}
            classes={{
              root: value === 2 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(2)}
            onClick={() => onTabChange('Cancelled members')}
          />

          {currentUser.role === USER_ROLES.ADMIN && (
            <CSVLink {...csvReport} className={classes.importCSVButton}>
              <Button disableElevation variant="text" className={classes.importCSVButton}>
                Export CSV
              </Button>
            </CSVLink>
          )}

          {currentUser.role === USER_ROLES.ADMIN && (
            <Button
              variant="contained"
              className={classes.addButton}
              onClick={handleAdd}
              disableElevation
            >
              Add new
            </Button>
          )}
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <ActiveUsersTab activeMembers={activeMembers} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <PendingUsersTab pendingMembers={pendingMembers} />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <CancelledUsersTab cancelledMembers={cancelledMembers} />
      </TabPanel>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    width: '95%',
    marginTop: 25,
    paddingLeft: 40,
  },
  tabLine: {
    borderRadius: 4,
  },
  selectedTab: {
    color: '#353535',
    background: '#E5E5E5',
    borderRadius: 21,
    minWidth: 'auto',
    width: 'auto',
    minHeight: 37,
    height: 37,
    marginRight: 18,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'Avenir',
  },
  tab: {
    minWidth: 'auto',
    width: 'auto',
    minHeight: 37,
    height: 37,
    borderRadius: 21,
    marginRight: 18,
    margin: 0,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 700,
    color: '#C0C0C0',
    fontFamily: 'Avenir',
  },
  addButton: {
    color: '#fff',
    background: '#5EA0E0',
    width: 90,
    height: 32,
    textTransform: 'none',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'Avenir',
    fontStyle: 'normal',
    lineHeight: '138.4%',
  },
  importCSVButton: {
    marginLeft: 'auto',
    color: '#C0C0C0',
    height: 32,
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 700,
    marginRight: 16,
    fontFamily: 'Avenir',
    fontStyle: 'normal',
    lineHeight: '130%',
  },
}))
