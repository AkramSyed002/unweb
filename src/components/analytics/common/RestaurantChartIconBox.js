import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import React from 'react'

export const RestaurantChartIconBox = ({
  icon,
  counter,
  countryName,
  style,
  LocationIconStyle,
  counterStyle,
  countryTextStyle,
  boxStyle,
  secondBoxStyle,
  thirdBoxStyle,
}) => {
  const classes = useStyles()
  return (
    <Grid item>
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid
          item
          className={classes.BoxStyle}
          style={boxStyle || secondBoxStyle || thirdBoxStyle}
        >
          <Grid item className={classes.iconStyle} style={LocationIconStyle}>
            {icon}
          </Grid>
        </Grid>
        <Grid item className={classes.counter} style={counterStyle}>
          {counter}
        </Grid>
        <Grid item className={classes.countryText} style={countryTextStyle}>
          {countryName}
        </Grid>
      </Grid>
    </Grid>

    // <Grid item container justifyContent="center">
    //   <Grid
    //     item
    //     container
    //     alignItems="center"
    //     justifyContent="center"
    //     className={classes.BoxStyle}
    //   >
    //     <Grid item className={classes.iconStyle} style={LocationIconStyle}>
    //       {icon}
    //     </Grid>
    //   </Grid>
    //   <Grid
    //     item
    //     container
    //     alignItems="center"
    //     justifyContent="center"
    //     className={classes.counter}
    //   >
    //     {counter}
    //   </Grid>
    //   <Grid
    //     item
    //     alignItems="center"
    //     justifyContent="center"
    //     className={classes.countryText}
    //   >
    //     {countryName}
    //   </Grid>
    // </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  BoxStyle: {
    height: 50,
    width: 50,
    background: 'rgba(94, 160, 224, 0.15)',
    borderRadius: 6,
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    color: '#5EA0E0',
  },
  counter: {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 18,
    color: '#464E5F',
  },
  countryText: {
    fontSize: 12,
    color: '#B5B5C3',
    fontWeight: 500,
    fontFamily: 'Poopins',
  },
}))
