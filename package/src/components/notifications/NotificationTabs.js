import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Divider, AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import Notifications from './tabs/Notifications'
import InAppChat from './tabs/InAppChat'

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
    // marginTop: 25,
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
  },
  markasReadButton: {
    marginLeft: 'auto',
    color: '#5EA0E0',
    background: 'none',
    width: 150,
    textTransform: 'none',
    marginTop: 50,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: 'Avenir',
    '&:hover': {
      background: 'none',
    },
  },
  tabBottomLine: {
    width: '100%',
    height: 5,
    borderRadius: 8,
    marginTop: -5,
  },
  notificationContainer: {
    background: '#F8F8F8',
    borderRadius: 16,
    marginBottom: 24,
    paddingTop: 24,
    paddingBottom: 24,
    // height: 78,
    marginTop: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 700,
    color: '#353535',
    paddingLeft: 40,
    fontFamily: 'Avenir',
  },
  notifications: {
    color: '#C0C0C0',
    marginLeft: 16,
  },
  expandIcon: {
    marginLeft: 'auto',
    marginRight: 43,
  },
  notiTitle: {
    color: '#353535',
    fontSize: 15,
  },
  notificationData: {
    background: '#fff',
    margin: 14,
    borderRadius: 8,
    height: 75,
    padding: 16,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#727272',
    margin: 5,
  },
  senderMessageContainer: {
    width: '82%',
    height: 44,
    backgroundColor: '#65CBFF',
    borderRadius: 8,
    paddingLeft: 10,
  },
  receiverMessageContainer: {
    width: '82%',
    height: 44,
    backgroundColor: '#202857',
    borderRadius: 8,
    paddingLeft: 10,
  },
  sendButton: {
    marginLeft: 'auto',
    background: '#65CBFF',
    padding: 8,
    borderRadius: 100,
  },
  exportCSVButton: {
    color: '#C0C0C0',
    height: 32,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 30,
    fontFamily: 'Avenir',
  },
}))

export default function NotificationTabs() {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      {/* <AppBar position="static" color="#fff" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          TabIndicatorProps={{
            style: {
              height: "5px",
              borderRadius: 4,
            },
          }}
        >
          <Tab
            label="Notifications"
            className={classes.tab}
            {...a11yProps(0)}
          />
          <Tab label="In-App Chat" className={classes.tab} {...a11yProps(1)} />
        </Tabs>
        <Divider light className={classes.tabBottomLine} />
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <Notifications classes={classes} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <InAppChat classes={classes} />
      </TabPanel> */}

      <Notifications classes={classes} />
    </div>
  )
}
