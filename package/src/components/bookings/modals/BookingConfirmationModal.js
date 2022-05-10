import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Modal,
  Select,
  Grid,
  Divider,
  MenuItem,
  Fab,
  Button,
} from '@material-ui/core'
import { Scrollbar } from 'react-scrollbars-custom'

import CloseIcon from '@material-ui/icons/Close'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import DateRangeIcon from '@material-ui/icons/DateRange'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import PersonIcon from '@material-ui/icons/Person'
import moment from 'moment'
import { convertToDateString } from '../../../utils/utils'
import { useAppContext } from '../../../context/AppContext'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 450,
    backgroundColor: theme.palette.background.paper,
    padding: '0px 40px 30px 40px',
    top: 100,
    left: '40%',
    borderRadius: 16,
  },
  title: {
    color: '#353535',
    fontSize: 22,
    fontWeight: 700,
    marginTop: 10,
    // marginBottom: 7,
  },
  bookingTitle: {
    color: '#353535',
    fontSize: 30,
    fontWeight: 700,
    marginTop: -10,
    marginRight: 'auto',
    fontFamily: 'Avenir',
  },
  bookingSubTitle: {
    color: '#353535',
    fontSize: 25,
    fontWeight: 700,
    marginTop: 20,
    fontFamily: 'Avenir',
  },
  bookingTime: {
    color: '#C0C0C0',
    fontSize: 13,
    fontWeight: 700,
  },
  detailsStatusSelect: {
    height: 56,
    marginTop: 30,
    borderRadius: 4,
    color: '#727272',
    fontWeight: 700,
    fontFamily: 'Avenir',
  },
  restTitle: {
    color: '#727272',
    fontWeight: 700,
    fontSize: 16,
    marginLeft: 15,
  },
  restSubTitle: {
    color: '#727272',
    fontWeight: 500,
    fontSize: 16,
    marginLeft: 15,
    width: '85%',
  },
  cancelText: {
    color: '#FF8888',
    fontSize: 16,
    fontWeight: 500,
    marginTop: 12,
  },
  noteTitle: {
    color: '#C0C0C0',
    fontWeight: 500,
    fontSize: 13,
    marginTop: 24,
  },
  textField: {
    width: 334,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    background: '#fff',
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#727272',
  },
  fabButton: {
    marginTop: -20,
    marginRight: -60,
    background: '#1D244D',
    color: '#fff',
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 16,
    color: '#C0C0C0',
  },
  checkboxLabel: {
    fontWeight: 700,
    fontSize: 16,
    color: '#353535',
  },
  avatar: {
    width: 200,
    height: 200,
    marginTop: 8,
  },
  chip: {
    border: '1.5px solid #353535',
    borderRadius: 8,
    background: '#fff',
    marginRight: 10,
  },
  subTitle: {
    color: '#727272',
    textAlign: 'center',
    marginBottom: 5,
  },
  saveButton: {
    fontSize: 18,
    fontWeight: 700,
    textTransform: 'none',
    textAlign: 'center',
    width: '50%',
    height: 50,
    color: '#fff',
    fontFamily: 'Avenir',
  },
  cancelButton: {
    fontSize: 18,
    fontWeight: 700,
    textTransform: 'none',
    textAlign: 'center',
    width: '50%',
    fontFamily: 'Avenir',
  },
  menuItem: {
    fontWeight: 500,
    fontSize: 16,
    color: '#353535',
  },
}))

const RenderIcon = ({ style, Icon, title }) => (
  <Grid item container style={{ marginTop: 10 }}>
    <Icon style={{ color: '#1D244D' }} />
    <Typography className={style}>{title}</Typography>
  </Grid>
)

const RenderReservationDetails = ({
  card,
  classes,
  handleTypeChange,
  confirmationTypes,
  descriptionChange,
}) => (
  <Grid item container direction="column">
    <Typography className={classes.bookingSubTitle}>
      Reservation Confirmation
    </Typography>
    <Divider light />
    <RenderIcon
      style={classes.restTitle}
      Icon={LocationOnIcon}
      title={card.restaurant_name}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={DateRangeIcon}
      title={moment(convertToDateString(card.booking_timestamp)).format(
        'ddd MMM DD, YYYY',
      )}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={AccessTimeIcon}
      title={moment(convertToDateString(card.booking_timestamp)).format(
        'hh:mm A',
      )}
    />
    <RenderIcon style={classes.restSubTitle} Icon={PersonIcon} title={4} />

    <Grid item container>
      <Select
        id="type"
        variant="outlined"
        fullWidth
        defaultValue={card.type}
        value={card.type}
        className={classes.detailsStatusSelect}
        InputProps={{
          className: classes.textFieldText,
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
        onChange={({ target }) => {
          handleTypeChange(target.value)
          const index = confirmationTypes.findIndex(
            (el) => el.type === target.value,
          )
          descriptionChange(confirmationTypes[index].description)
        }}
      >
        <MenuItem disabled>Select</MenuItem>
        {confirmationTypes &&
          confirmationTypes.map((el, i) => (
            <MenuItem
              key={i.toString()}
              value={el.type}
              className={classes.menuItem}
            >
              {el.type}
            </MenuItem>
          ))}
      </Select>
    </Grid>
    <Grid item container>
      <input
        aria-multiline
        value={card.description}
        onChange={({ target }) => {
          descriptionChange(target.value)
        }}
        placeholder="Description"
      />
    </Grid>
  </Grid>
)

export default function BookingConfirmationModal({
  card,
  bookingConfirmationModal,
  handleBookingConfirmationModalClose,
  onTypeChange,
  descriptionChange,
  onSavePress,
  loading,
}) {
  const classes = useStyles()
  const { confirmationTypes } = useAppContext()

  const handleTypeChange = (value) => {
    const index = confirmationTypes.findIndex((el) => el.type === value)
    onTypeChange(
      confirmationTypes[index].type,
      confirmationTypes[index].description,
    )
  }

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleBookingConfirmationModalClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Typography className={classes.bookingTitle}>
          Booking Details
        </Typography>
        <RenderReservationDetails
          card={card}
          classes={classes}
          handleTypeChange={handleTypeChange}
          confirmationTypes={confirmationTypes}
          descriptionChange={descriptionChange}
        />
        <Grid item container style={{ marginTop: 40 }}>
          <Button
            variant="text"
            color="primary"
            className={classes.cancelButton}
            onClick={handleBookingConfirmationModalClose}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            className={classes.saveButton}
            onClick={() => {
              onSavePress()
            }}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Scrollbar>
  )

  return (
    <Modal
      open={bookingConfirmationModal}
      onClose={handleBookingConfirmationModalClose}
    >
      {body}
    </Modal>
  )
}
