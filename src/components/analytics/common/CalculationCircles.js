import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

export const CalculationCircles = ({ counter, title, subTitle, style }) => {
  const classes = useStyles()
  return (
    <Grid item style={{ padding: 15 }}>
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        className={classes.mainCircle}
        style={style}
      >
        <Grid item md={6}>
          <p className={classes.counter}>
            {counter} <sup className={classes.percentSign}>%</sup>
          </p>
        </Grid>
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        style={{ width: 180 }}
      >
        <Grid item md={6}>
          <Typography className={classes.title}>{title}</Typography>
          <Typography className={classes.subTitle}>{subTitle}</Typography>
        </Grid>
      </Grid>
    </Grid>

    // <Grid item justifyContent="center" direction="row">
    //   <div className={classes.mainCircle} style={style}>
    //     <p className={classes.counter}>
    //       {counter} <sup className={classes.percentSign}>%</sup>
    //     </p>
    //   </div>
    //   <Grid item container>
    //     <Typography className={classes.title}>{title}</Typography>
    //   </Grid>
    //   <Typography className={classes.subTitle}>{subTitle}</Typography>
    // </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  mainCircle: {
    width: 180,
    height: 180,
    borderRadius: '50%',
    backgroundColor: '#77A7DF',
    textAlign: 'center',
  },
  // mainCircle: {
  //   width: 130,
  //   height: 130,
  //   borderRadius: '50%',
  //   backgroundColor: '#77A7DF',
  //   textAlign: 'center',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   display: 'flex',
  // },
  counter: {
    fontSize: 30,
    color: '#FFFF',
    fontFamily: 'Avenir',
  },
  percentSign: {
    fontSize: 16,
    fontFamily: 'Avenir',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Avenir',
    fontWeight: 800,
    color: '#3F4254',
    textAlign: 'center',
    marginTop: 15,
  },
  subTitle: {
    color: '#727272',
    fontSize: 13,
    fontFamily: 'Avenir',
    fontWeight: 800,
  },
}))

// import { Grid, Typography } from '@material-ui/core'
// import { makeStyles } from '@material-ui/styles'
// import React from 'react'

// export const CalculationCircles = ({ counter, title, subTitle, style }) => {
//   const classes = useStyles()
//   return (
//     <Grid item style={{ marginTop: -60, }}>
//       <Grid item container alignItems="center" justifyContent="center">
//         <Grid item container className={classes.mainCircle} style={style}>
//           <p className={classes.counter} style={style}>
//             {counter} <sup className={classes.percentSign}>%</sup>
//           </p>
//           <Grid item container style={{ marginTop: 15 }}>
//             <Typography className={classes.title} style={style}>
//               {title}
//             </Typography>
//             <Typography className={classes.subTitle} style={style}>
//               {subTitle}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   )
// }

// const useStyles = makeStyles((theme) => ({
//   mainCircle: {
//     width: 130,
//     height: 130,
//     borderRadius: '50%',
//     backgroundColor: '#77A7DF',
//     textAlign: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   counter: {
//     fontSize: 30,
//     color: '#FFFF',
//     fontFamily: 'Avenir',
//   },
//   percentSign: {
//     fontSize: 16,
//     fontFamily: 'Avenir',
//   },
//   title: {
//     fontSize: 16,
//     fontFamily: 'Avenir',
//     fontWeight: 800,
//     color: '#3F4254',
//     textAlign: 'center',
//     marginTop: 15,
//   },
//   subTitle: {
//     color: '#727272',
//     fontSize: 13,
//     fontFamily: 'Avenir',
//     fontWeight: 800,
//   },
// }))
