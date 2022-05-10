import { Grid, makeStyles, Typography } from '@material-ui/core'
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined'
import React from 'react'
import Home from '../../../assets/icons/Home.png'
import restaurant from '../../../assets/icons/restaurant.png'
import { Card } from '../common/Card'
import { TabsHeader } from '../common/TabsHeader'
import { RestaurantTabsCard } from '../common/RestaurantTabsCard'
import user from '../../../assets/icons/user.png'
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined'
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined'
import { RestaurantTabChart } from '../common/RestaurantTabChart'

export const RestaurantTab = () => {
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
        <TabsHeader title="Restaurants" icon={<FilterListOutlinedIcon />} />
        <Grid
          item
          container
          className={classes.cardContainer}
          justifyContent="space-between"
        >
          <Card
            icon={<img src={Home} alt="" />}
            counter="New York"
            title="Number of Bookings"
          />
          <Card
            icon={<img src={restaurant} alt="" />}
            counter="New York"
            title="Most used ‘other’ restaurant"
            countryInfo
            countryInfoTitle="London Miami Hong Kong"
          />
          <Card
            icon={
              <CalendarTodayOutlinedIcon
                className={classes.calculationIconStyle}
              />
            }
            counter="55"
            title="Number of Bookings"
          />
          <Card
            icon={
              <CalendarTodayOutlinedIcon
                className={classes.calculationIconStyle}
              />
            }
            counter="55"
            title="Number of Bookings"
            countryInfo
            countryInfoTitle="Jan 10 - 12"
          />
          <Card
            icon={<AccessTimeOutlinedIcon className={classes.timeIconStyle} />}
            counter="55"
            title="Number of Bookings"
          />
        </Grid>
        <Grid item container className={classes.chartContainer}>
          <RestaurantTabChart />
        </Grid>
        <Grid
          item
          container
          className={classes.counterCardsContainer}
          justifyContent="space-between"
        >
          <RestaurantTabsCard
            icon={<img src={user} alt="" className={classes.userIconStyle} />}
            title="Total number of bookings"
            counter="55"
          />
          <RestaurantTabsCard
            icon={<img src={user} alt="" className={classes.userIconStyle} />}
            title="Number of declined requests"
            counter="55"
          />
          <RestaurantTabsCard
            textContainerCard
            textContainerCardTitle="% of no late arrivals"
            textContainerCardTitleSecond="% of no shows"
            textContainerCardTitleThirld="Late arrivals for reservations"
            textContainerCardCounter="33%"
            textContainerCardCounterSecond="33%"
            textContainerCardCounterThirld="33%"
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
  chartContainer: {
    marginTop: 27,
  },
  chartSubContainer: {
    backgroundColor: ' #FFFFFF',
    borderRadius: 12,
    padding: '15px 15px 15px 15px',
    // height: 400,
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
}))
