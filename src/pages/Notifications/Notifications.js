import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Grid,
  Paper,
  InputBase,
  IconButton,
  Typography,
} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import NotificationTabs from '../../components/notifications/NotificationTabs'

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 223,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: 335,
    height: 50,
    marginTop: 20,
    marginLeft: 40,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: "#C0C0C0",
    fontFamily: "Avenir",
  },
  iconButton: {
    padding: 10,
  },
  bellIcon: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
    marginRight: 45,
  },
  title: {
    color: '#353535',
    fontWeight: 700,
    fontSize: 34,
    marginTop: 40,
    marginLeft: 40,
    fontFamily: 'AvenirBold',
    fontStyle: 'normal',
  },
}))

const RenderHeader = ({ classes }) => (
  <Grid item container alignItems="center">
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
      />
      {/* <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon style={{ color: '#5EA0E0' }} />
      </IconButton> */}
    </Paper>
  </Grid>
)

export default function Notifications() {
  const classes = useStyles()

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      {/* <RenderHeader classes={classes} /> */}
      <Typography className={classes.title}>Notifications</Typography>
      <NotificationTabs />
    </Grid>
  )
}
