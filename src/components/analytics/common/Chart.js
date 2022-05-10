import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

import { BarChart } from '../common/BarChart.js'

export const Chart = ({
  icon,
  title,
  counter,
  hours,
  subTitleText,
  reservationIconStyle,
  bookingIconStyle,
  bookingTitle,
  reservationTitle,
  reservationTitleStyle,
}) => {
  const classes = useStyles()
  return (
    <Grid item className={classes.chartContainer}>
      <Grid
        item
        container
        alignItems="center"
        className={classes.itemsContainer}
      >
        <img src={icon} alt="" className={classes.timeIcon} />
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid
        item
        container
        className={classes.hoursStyle}
        justifyContent="flex-end"
      >
        <Typography className={classes.counter}>{counter}</Typography>
        <Typography className={classes.hours}>{hours}</Typography>
      </Grid>
      <Typography className={classes.subTitleText}>{subTitleText}</Typography>
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '600px',
        }}
      >
        <BarChart />
      </Grid>
      <Grid item container className={classes.chartStatusText}>
        <List>
          <ListItem>
            <IconButton>
              <FiberManualRecordIcon
                className={classes.bookingIconStyle}
                style={bookingIconStyle}
              />
            </IconButton>
            <ListItemText className={classes.bookingTitle}>
              {bookingTitle}
            </ListItemText>
            <IconButton>
              <FiberManualRecordIcon
                className={classes.reservationIconStyle}
                style={reservationIconStyle}
              />
            </IconButton>
            <ListItemText
              className={classes.reservationTitle}
              style={reservationTitleStyle}
            >
              {reservationTitle}
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}
const useStyles = makeStyles((theme) => ({
  chartContainer: {
    backgroundColor: ' #FFFFFF',
    borderRadius: 12,
    width: 650,
    // overflowX: 'auto',
    padding: '15px 15px 15px 15px',
  },
  chartMainContainer: {
    marginTop: 27,
  },
  timeIcon: {
    color: '#FF8888',
    heigth: 22,
    width: 20,
  },
  itemsContainer: {
    marginTop: 25,
  },
  title: {
    color: '#3F4254',
    fontSize: 16,
    fontFamily: 'Avenir',
    marginLeft: 30,
  },
  hoursStyle: {
    width: 450,
    marginLeft: 100,
  },
  counter: {
    fontSize: 28,
    color: '#1D244D',
  },
  hours: {
    fontSize: 16,
    fontFamily: 'Avenir',
    fontWeight: 800,
    marginTop: 14,
    marginLeft: 5,
  },
  subTitleText: {
    marginLeft: 490,
    color: ' #C0C0C0',
    fontSize: 15,
    fontFamily: 'Avenir',
    marginTop: -10,
  },
  chartStatusText: {
    marginLeft: 40,
  },
  bookingTitle: {
    color: '#77A7DF',
    fontSize: 15,
    fontWeight: 800,
    fontFamily: 'Avenir',
  },
  reservationTitle: {
    color: '#1D244D',
    fontSize: 15,
    fontWeight: 800,
    fontFamily: 'Avenir',
  },
  bookingIconStyle: {
    color: '#77A7DF',
    width: 15,
    height: 15,
  },
  reservationIconStyle: {
    color: '#1D244D',
    width: 15,
    height: 15,
  },
}))
