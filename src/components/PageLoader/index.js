import React from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyle = makeStyles((theme) => ({
    box: {
        background: 'rgba(0,0,0,0.9)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color : '#fff'
     }
  }))

const PageLoader = () => {
    const classes = useStyle();

    return (
        <Box className={classes.box}>
            <CircularProgress color='inherit' /><br />
            <Typography>Please wait ...</Typography>
        </Box>
    )
}

export default PageLoader;