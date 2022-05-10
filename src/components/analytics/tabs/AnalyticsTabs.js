import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Button,
  Divider,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { MembershipTab } from './MembershipTab'
import { RestaurantTab } from './RestaurantTab'

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
    width: '95%',
    marginTop: 25,
    paddingLeft: 40,
  },
  tabLine: {
    borderBottom: '4px solid #E5E5E5',
    borderRadius: 4,
  },
  tab: {
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 800,
    fontFamily: 'Avenir',
    fontStyle: 'normal',
    color: '#C0C0C0',
  },
  addButton: {
    marginLeft: 'auto',
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
  },
  tabBottomLine: {
    width: '100%',
    height: 5,
    borderRadius: 8,
    marginTop: -5,
  },
}))

export default function AnalyticsTabs({
  onTabChange,
  restaurantsData,
  adminsData,
  handleDeleteAdmin,
}) {
  const classes = useStyles()
  const theme = useTheme()
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
          indicatorColor="primary"
          textColor="primary"
          TabIndicatorProps={{
            style: {
              height: '5px',
              borderRadius: 4,
            },
          }}
        >
          <Tab
            label="Membership"
            className={classes.tab}
            {...a11yProps(0)}
            onClick={() => onTabChange('MemberShip')}
          />
          <Tab
            label="Restaurants"
            className={classes.tab}
            {...a11yProps(1)}
            onClick={() => onTabChange('Restaurants')}
          />
        </Tabs>
        <Divider light className={classes.tabBottomLine} />
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <MembershipTab />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <RestaurantTab />
      </TabPanel>
    </div>
  )
}
