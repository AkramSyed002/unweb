import React from 'react';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';
import { Grid, Typography, Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyle = makeStyles((theme) => ({
    rootBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'white'
    },
    childBox: {
        transform: 'translate(0%, 50%)'
    }
}))

// import {
//   Container,
//   Box,
//   Columns,
//   Column,
//   Text,
//   Subtitle,
//   Paragraph,
// } from '@safelyq/bulma-ui-library';

// const StyledBody = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100vh;
//   background: white;
// `;

// const StyledBox = styled(Box)`
//   transform: translate(0%, 50%);
// `;

export const ErrorSection = () => {
    const classes = useStyle();

    return (
        <Box className={classes.rootBox}>
            <Container>
                <Box className={classes.childBox}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>
                            <a href='/'>
                                <img src={'/logo.png'} width={150} />
                            </a>
                            </Typography><br />
                            <Typography variant='h5'>
                                <strong>Oops,</strong> something went wrong.
                            </Typography><br />
                            <Typography size='6'>
                                UNome encountered temporary error and could not complete your
                                request.
                            </Typography>
                            <Typography>
                                Please try to reload this page, or come back to it in a few
                                minutes.
                            </Typography>
                            <Typography><a href='/' style={{color: '#000'}}>Click to go back</a></Typography>
                            <br />
                            <Typography>
                                <strong>We're sorry for the inconvenience.</strong>
                                <br />
                                <small>UNome Team</small>
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>
                                <img src={'/server-error.png'} width={150} />
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

    // <StyledBody>
    //   <Container>
    //     <StyledBox>
    //       <Columns multiline centered>
    //         <Column size={6}>
            //   <Paragraph className='mb-4'>
            //     <Link to='/'>
            //       <img src={'/images/logo.png'} width={150} />
            //     </Link>
            //   </Paragraph>
    //           <Text size='6'>
    //             <strong>Oops,</strong> something went wrong.
    //           </Text>
            //   <Subtitle size='6' className='my-4'>
            //     SafelyQ encountered temporary error and could not complete your
            //     request.
            //   </Subtitle>
            //   <Paragraph>
            //     Please try to reload this page, or come back to it in a few
            //     minutes.
            //   </Paragraph>
            //   <Paragraph className='mt-3'>
            //     <strong>We're sorry for the inconvenience.</strong>
            //     <br />
            //     <small>SafelyQ Team</small>
            //   </Paragraph>
    //         </Column>
    //         <Column size={4} className='is-hidden-mobile'>
            //   <Paragraph>
            //     <img src={'/images/server-error.png'} width={150} />
            //   </Paragraph>
    //         </Column>
    //       </Columns>
    //     </StyledBox>
    //   </Container>
    // </StyledBody>