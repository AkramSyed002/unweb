import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

export const Card = ({
  icon,
  counter,
  title,
  style,
  countryInfo,
  countryInfoTitle,
}) => {
  const classes = useStyles()
  return (
    <Grid className={classes.cardBoxStyle}>
      <Grid item container justifyContent="space-between">
        <div className={classes.icon} style={style}>
          {icon}
        </div>
        <div className={classes.counter} style={style}>
          {counter}
        </div>
      </Grid>
      {countryInfo && (
        <div className={classes.countryInfoStyle}>{countryInfoTitle}</div>
      )}
      <div className={classes.title} style={style}>
        {title}
      </div>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  cardBoxStyle: {
    height: 130,
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: '15px 15px 15px 15px',
  },
  icon: {
    height: 16,
    width: 22,
    color: '#5EA0E0',
  },
  counter: {
    fontSize: 34,
    fontFamily: 'Avenir',
    color: '#3F4254',
    fontWeight: 800,
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: 800,
    color: '#3F4254',
    marginTop: 22,
  },
  countryInfoStyle: {
    fontSize: 13,
    fontFamily: 'Avenir',
    color: '#C0C0C0',
    fontWeight: 800,
    width: 90,
    marginLeft: 140,
    display: 'flex',
    flexWrap: 'wrap',
    height: 30,
  },
}))
