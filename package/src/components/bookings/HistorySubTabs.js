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
import { useHistory } from 'react-router-dom'
import HistoryTable from './tabs/HistoryTable'
import { getArrayByStatus } from '../../utils/utils'
import { BOOKING_STATUS } from '../../constants'

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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 25,
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
    textTransform: 'capitalize',
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
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: 700,
    color: '#C0C0C0',
    fontFamily: 'Avenir',
  },
}))

export default function HistorySubTabs({ bookings }) {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
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
            label={`History ${
              getArrayByStatus(
                bookings,
                BOOKING_STATUS.PENDING,
                BOOKING_STATUS.CONFIRMED,
                BOOKING_STATUS.COMPLETED,
              ).length
            }`}
            classes={{
              root: value === 0 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(0)}
          />
          <Tab
            label={`Cancellation ${
              getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED).length
            }`}
            classes={{
              root: value === 1 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(1)}
          />
          <Tab
            label={`No-Shows ${
              getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length
            }`}
            classes={{
              root: value === 2 ? classes.selectedTab : classes.tab,
            }}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <HistoryTable
          title={`History`}
          count={
            getArrayByStatus(
              bookings,
              BOOKING_STATUS.PENDING,
              BOOKING_STATUS.CONFIRMED,
              BOOKING_STATUS.COMPLETED,
            ).length
          }
          bookings={getArrayByStatus(
            bookings,
            bookings,
            BOOKING_STATUS.PENDING,
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.COMPLETED,
          )}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <HistoryTable
          title="Cancelled"
          count={getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED).length}
          bookings={getArrayByStatus(bookings, BOOKING_STATUS.CANCELLED)}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <HistoryTable
          title="No-Show"
          count={getArrayByStatus(bookings, BOOKING_STATUS.NO_SHOW).length}
        />
      </TabPanel>
    </div>
  )
}
