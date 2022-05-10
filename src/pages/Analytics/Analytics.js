import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { useState } from 'react'
import AnalyticsTabs from '../../components/analytics/tabs/AnalyticsTabs'

export const Analytics = () => {
  const [searchTab, setSearchTab] = useState('Restaurants')
  const classes = useStyles()
  return (
    <Grid item container className={classes.mainContainer}>
      <Typography className={classes.title}>Analytics</Typography>
      <AnalyticsTabs onTabChange={(value) => setSearchTab(value)} />
    </Grid>
  )
}

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
    color: '#C0C0C0',
  },
  title: {
    color: '#353535',
    // color: '#000',
    fontWeight: 700,
    fontSize: 40,
    marginTop: 40,
    marginLeft: 40,
    fontFamily: 'AvenirBold',
    fontStyle: 'normal',
  },
}))
