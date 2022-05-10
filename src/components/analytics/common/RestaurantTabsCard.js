import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

export const RestaurantTabsCard = ({
  icon,
  counter,
  title,
  textContainerCard,
  textContainerCardTitle,
  textContainerCardTitleSecond,
  textContainerCardTitleThirld,
  textContainerCardCounter,
  textContainerCardCounterSecond,
  textContainerCardCounterThirld,
}) => {
  const classes = useStyles()
  return (
    <Grid item container className={classes.counterCards}>
      <Grid item container justifyContent="space-between">
        <div className={classes.icon}>{icon}</div>
        <Typography className={classes.counter}>{counter}</Typography>
      </Grid>
      <Grid item container>
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      {textContainerCard && (
        <Grid item container justifyContent="space-between">
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className={classes.textCounterCardTitle}>
              {textContainerCardTitle}
            </Typography>
            <div className={classes.smallBoxCounter}>
              <Typography className={classes.textContainerCardCounter}>
                {textContainerCardCounter}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 5 }}
          >
            <Typography className={classes.textCounterCardTitle}>
              {textContainerCardTitleSecond}
            </Typography>
            <div className={classes.smallBoxCounter}>
              <Typography className={classes.textContainerCardCounter}>
                {textContainerCardCounterSecond}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 5 }}
          >
            <Typography className={classes.textCounterCardTitle}>
              {textContainerCardTitleThirld}
            </Typography>
            <div className={classes.smallBoxCounter}>
              <Typography className={classes.textContainerCardCounter}>
                {textContainerCardCounterThirld}
              </Typography>
            </div>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 16,
    width: 22,
    color: '#5EA0E0',
  },
  counterCards: {
    height: 160,
    width: 365,
    borderRadius: 12,
    backgroundColor: '#FFFF',
    padding: '15px 15px 15px 15px',
  },
  counter: {
    fontSize: 34,
    fontFamily: 'Avenir',
    color: '#3F4254',
    fontWeight: 800,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Avenir',
    fontWeight: 800,
    color: '#3F4254F',
  },
  smallBoxCounter: {
    width: 50,
    height: 33,
    background: 'rgba(255, 136, 136, 0.15)',
    borderRadius: 6,
  },
  textCounterCardTitle: {
    fontSize: 16,
    fontFamily: 'Avenir',
    color: '#3F4254',
    fontWeight: 800,
    // marginTop: 5,
  },
  textContainerCardCounter: {
    color: '#FF8888',
    textAlign: 'center',
  },
}))
