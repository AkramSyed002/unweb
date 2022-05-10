import { Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { CircleChart } from './CircleChart'
import { RestaurantChartIconBox } from './RestaurantChartIconBox'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import internet from '../../../assets/icons/internet.png'
import calendarBox from '../../../assets/icons/calendarBox.png'

export const RestaurantTabChart = () => {
  const classes = useStyles()
  return (
    <Grid item container className={classes.chartSubContainer}>
      <Typography className={classes.chartTitle}>
        Number of bookings past
      </Typography>
      <Grid item container>
        <Typography className={classes.chartCounter}>Total 293,000</Typography>
      </Grid>
      <Grid item container justifyContent="center" alignItems="center">
        <Grid item container className={classes.chartContainer}>
          <CircleChart />
        </Grid>
      </Grid>
      <Grid item container justifyContent="center" md={12}>
        <Grid item container md={4} justifyContent="space-between">
          <RestaurantChartIconBox
            icon={<LocationOnIcon />}
            counter="255"
            countryName="New York"
          />
          <RestaurantChartIconBox
            icon={<img src={internet} alt="" />}
            counter="7200"
            countryName="Globally"
            secondBoxStyle={secondBoxStyle}
          />
          <RestaurantChartIconBox
            icon={<img src={calendarBox} alt="" />}
            counter="Jan-feb"
            countryName="Time Between"
            thirdBoxStyle={thirdBoxStyle}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  chartSubContainer: {
    backgroundColor: ' #FFFFFF',
    borderRadius: 12,
    padding: '15px 15px 15px 15px',
  },
  chartTitle: {
    fontSize: 17,
    fontFamily: 'Poppins',
    fontWeight: 600,
    color: '#464E5F',
  },
  chartCounter: {
    color: '#80808F',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: 500,
  },
  counterCardsContainer: {
    marginTop: 20,
  },
  userIconStyle: {
    width: 16,
    height: 16,
    color: '#70C78D',
  },
  calculationIconStyle: {
    color: '#FFDC88',
  },
  timeIconStyle: {
    color: '#70C78D',
  },
  chartContainer: {
    height: 300,
    width: 300,
  },
}))

const secondBoxStyle = {
  background: 'rgba(255, 136, 136, 0.15)',
}

const thirdBoxStyle = {
  background: 'rgba(112, 199, 141, 0.15)',
}
