import { Grid, makeStyles } from '@material-ui/core'
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined'
import React from 'react'
import { CalculationCircles } from '../common/CalculationCircles'
import calculation from '../../../assets/icons/calculation.png'
import Time from '../../../assets/icons/Time.png'
import { Card } from '../common/Card'
import { TabsHeader } from '../common/TabsHeader'
import { Chart } from '../common/Chart'
import HiddenEye from '../../../assets/icons/HiddenEye.png'
import GreenTime from '../../../assets/icons/GreenTime.png'

export const MembershipTab = () => {
  const classes = useStyles()
  return (
    <Grid
      item
      container
      className={classes.mainConatainer}
      md={12}
      lg={12}
      sm={12}
      xs={12}
    >
      <Grid item container className={classes.subMainContainer}>
        <TabsHeader title="Members" icon={<FilterListOutlinedIcon />} />
        <Grid
          item
          container
          className={classes.cardContainer}
          justifyContent="space-between"
        >
          <Card
            icon={<FilterListOutlinedIcon />}
            counter="55"
            title="Number of Bookings"
          />
          <Card
            icon={<img src={HiddenEye} alt="" />}
            counter="33%"
            title="Number of Bookings"
          />
          <Card
            icon={<img src={GreenTime} alt="" />}
            counter="7"
            title="Number of Bookings"
          />
          <Card
            icon={<img src={Time} alt="" />}
            counter="3"
            title="Number of Bookings"
          />
          <Card
            icon={<FilterListOutlinedIcon />}
            counter="55"
            title="Number of Bookings"
          />
        </Grid>
        <Grid
          item
          container
          className={classes.calculationConatiner}
          direction="row"
          justifyContent="space-between"
        >
          <img src={calculation} alt="" className={classes.calculationImg} />
          <Grid item container justifyContent="space-evenly">
            <CalculationCircles
              counter="32"
              title="Percentage of cancellations "
              subTitle="within a 4hour window from the booking time"
            />
            <CalculationCircles
              counter="8"
              title="Percentage of bookings falling within Golden Rules"
              subTitle="(4hrs & 6PAX)"
              style={bookingsPercentage}
            />
            <CalculationCircles
              counter="32"
              title="Percentage of No Shows"
              style={averageParty}
            />
            <CalculationCircles
              counter="32"
              title="Percentage of No Shows"
              style={noShowsPercentage}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          md={12}
          lg={12}
          className={classes.chartMainContainer}
          justifyContent="space-between"
        >
          <Chart
            icon={Time}
            title="Average time between booking and reservation"
            counter="2"
            hours="hours"
            subTitleText="Average"
            bookingTitle="Booking"
            reservationTitle="Reservation"
          />
          <Chart
            icon={Time}
            title="Average time between cancellation and booking"
            counter="2"
            hours="hours"
            subTitleText="Average"
            bookingTitle="Booking"
            reservationTitle="Reservation"
            reservationIconStyle={reservationIconStyle}
            reservationTitleStyle={reservationTitleStyle}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  mainConatainer: {
    marginTop: 32,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    height: 'auto',
  },
  subMainContainer: {
    padding: '32px 32px',
  },
  cardContainer: {
    marginTop: 25,
  },
  calculationConatiner: {
    padding: '15px 15px 15px 15px',
    backgroundColor: '#FFFF',
    borderRadius: 12,
    marginTop: 17,
    // height: 320,
  },
  calculationImg: {
    height: 22,
    width: 20,
    color: '#5EA0E0',
    padding: '19px 19px',
  },
  chartMainContainer: {
    marginTop: 27,
  },
  timeIcon: {
    marginTop: 25,
  },
  bookingsPercentage: {
    backgroundColor: '#FFDC88',
  },
}))
const bookingsPercentage = {
  backgroundColor: '#FFDC88',
}
const averageParty = {
  backgroundColor: '#70C78D',
}
const noShowsPercentage = {
  backgroundColor: '#FF8888',
}

const reservationIconStyle = {
  color: '#FF8888',
}
const reservationTitleStyle = {
  color: '#FF8888',
  fontSize: 15,
  fontWeight: 800,
  fontFamily: 'Avenir',
}
