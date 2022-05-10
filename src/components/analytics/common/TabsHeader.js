import { Grid, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

export const TabsHeader = ({ title, icon, style }) => {
  const classes = useStyles()
  return (
    <Grid item container justifyContent="space-between" alignItems="center">
      <Typography className={classes.title} style={style}>
        {title}
      </Typography>
      <IconButton className={classes.icon} style={style}>
        {icon}
      </IconButton>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#353535',
    fontFamily: 'Avenir',
    fontSize: 22,
    fontWeight: 800,
  },
  icon: {
    // heigth: 32,
    // width: 32,
    border: '#C0C0C0 solid 1px',
    borderRadius: 4,
    color: '#C0C0C0',
  },
}))
