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
  TextField,
  Avatar,
  Button,
  Chip,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import DateRangeIcon from '@material-ui/icons/DateRange'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import PersonIcon from '@material-ui/icons/Person'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

import profile from '../../../assets/images/pendingCard3.png'
import DeleteBookingModal from './DeleteBookingModal'
import Scrollbar from 'react-scrollbars-custom'
import BookingConfirmationModal from './BookingConfirmationModal'
import moment from 'moment'
import { convertToDateString } from '../../../utils/utils'
import { useLocation } from 'react-router'
import { BOOKING_STATUS } from '../../../constants'
import BookingModal from './BookingModal'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    padding: '0px 40px 50px 40px',
    top: 50,
    left: '27%',
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
    fontFamily: 'Avenir',
  },
  bookingSubTitle: {
    color: '#353535',
    fontSize: 22,
    fontWeight: 700,
    marginTop: 20,
  },
  bookingCancelledTime: {
    color: '#FF8888',
    fontSize: 16,
    fontWeight: 700,
  },
  detailsStatusSelect: {
    width: 229,
    height: 32,
    marginLeft: 30,
    borderRadius: 4,
    // marginBottom: 12,
    // marginTop: 12,
    color: '#fff',
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
    width: 100,
    height: 100,
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
    textAlign: 'flex-start',
    marginBottom: 5,
  },
  deleteButton: {
    textTransform: 'none',
    color: '#FF8888',
    marginTop: 30,
    fontSize: 16,
    fontWeight: 500,
    '&:hover': {
      background: 'none',
    },
  },
  editButton: {
    textTransform: 'none',
    color: '#77A7DF',
    marginTop: 30,
    fontSize: 16,
    fontWeight: 500,
    marginRight: 25,
    '&:hover': {
      background: 'none',
    },
  },
  viewProfileButton: {
    textTransform: 'none',
    padding: 0,
    margin: 0,
    width: 142,
  },
  noticeContainer: {
    background: '#FFE7E7',
    height: 95,
    borderRadius: 8,
    marginTop: 16,
    padding: '10px 0px 0px 16px',
    marginBottom: 20,
  },
}))

const RenderIcon = ({ style, Icon, title }) => (
  <Grid item container style={{ marginTop: 10 }}>
    <Icon style={{ color: '#1D244D' }} />
    <Typography className={style}>{title}</Typography>
  </Grid>
)

const RenderReservationDetails = ({
  record,
  classes,
  handleDeleteBookingModalOpen,
  handleBookingConfirmModalOpen,
}) => (
  <Grid item container direction="column" style={{ width: 360 }}>
    <Typography className={classes.bookingSubTitle}>
      Reservation Details
    </Typography>
    <Divider light />
    <Grid item container className={classes.noticeContainer}>
      <Typography style={{ color: '#FF8888' }}>NOTICE</Typography>
      <Typography>
        Member has a party of 6 or more.{' '}
        <span style={{ fontWeight: 700 }}>Not within the Golden Rules.</span>
      </Typography>
    </Grid>
    <RenderIcon
      style={classes.restTitle}
      Icon={LocationOnIcon}
      title={record.restaurant_name}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={DateRangeIcon}
      title={moment(convertToDateString(record.booking_timestamp)).format(
        'ddd MMM DD, YYYY',
      )}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={AccessTimeIcon}
      title={moment(convertToDateString(record.booking_timestamp)).format(
        'hh:mm A',
      )}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={PersonIcon}
      title={record.guests}
    />
    <RenderIcon
      style={classes.restSubTitle}
      Icon={InsertDriveFileIcon}
      title={record && record.special_requirements}
    />
    <Grid item container justify="space-between">
      <Button
        variant="text"
        className={classes.deleteButton}
        onClick={() => handleDeleteBookingModalOpen(record)}
      >
        Delete booking
      </Button>
      <Button
        variant="text"
        className={classes.editButton}
        onClick={handleBookingConfirmModalOpen}
      >
        Edit booking
      </Button>
    </Grid>
  </Grid>
)

const RenderMemberInfo = ({ classes, record, onViewProfile }) => (
  <Grid item container direction="column" style={{ width: 320 }}>
    <Typography className={classes.bookingSubTitle}>
      Member Information
    </Typography>
    <Divider light />
    <Typography className={classes.label}>CONTACT</Typography>

    <Grid item container justify="center">
      <Grid item container style={{ width: '35%' }}>
        <Avatar src={record.user_avatar} className={classes.avatar} />
      </Grid>
      <Grid item container direction="column" style={{ width: '65%' }}>
        <Typography style={{ color: '#353535', fontSize: 20, fontWeight: 500 }}>
          {record.user_name}
        </Typography>
        <Typography variant="body1" className={classes.subTitle}>
          {record.user_email}
        </Typography>
        <Typography variant="body1" className={classes.subTitle}>
          {record.user_phone_number}
        </Typography>
        <Button
          variant="text"
          className={classes.viewProfileButton}
          color="primary"
          onClick={() => onViewProfile(record.user_id)}
        >
          View Client Profile
        </Button>
      </Grid>
    </Grid>
    <Typography className={classes.label}>Allergies</Typography>
    <Grid item container>
      {record &&
        record.guest_allergies &&
        record.guest_allergies.map((el, i) => (
          <Chip key={i.toString()} label={el} className={classes.chip} />
        ))}
    </Grid>
    <Typography className={classes.label}>Dietary Requirements</Typography>
    <Grid item container>
      {record &&
        record.guest_dietary_requirements &&
        record.guest_dietary_requirements.map((el, i) => (
          <Chip key={i.toString()} label={el} className={classes.chip} />
        ))}
    </Grid>
    <Grid item container>
      <Typography className={classes.noteTitle}>ADDITIONAL NOTES</Typography>
      <TextField
        value={record.additional_notes}
        fullWidth
        variant="outlined"
        multiline
        rows={2}
        placeholder="Only you can see this"
        InputProps={{
          className: classes.textFieldText,
        }}
        disabled
      />
    </Grid>
  </Grid>
)

export default function CancelledBookingDetailsModal({
  record,
  cancelledBookingDetailsModal,
  handleModalClose,
  bookingStatus,
  onDelete,
  onEdit,
}) {
  const classes = useStyles()

  const [status, setStatus] = useState(bookingStatus)
  const [deleteBookingModal, setDeleteBookingModal] = useState(false)
  const [bookingConfirmationModal, setBookingConfirmationModal] = useState(
    false,
  )
  const location = useLocation()

  const handleBookingConfirmModalOpen = () => {
    setBookingConfirmationModal(true)
  }

  const handleBookingConfirmModalClose = () => {
    setBookingConfirmationModal(false)
  }

  const handleDeleteBookingModalOpen = () => {
    setDeleteBookingModal(true)
  }

  const handleDeleteBookingModalClose = () => {
    setDeleteBookingModal(false)
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value)
  }

  const onDeleteBooking = async () => {
    onDelete()
    handleDeleteBookingModalClose()
  }

  const onEditBooking = (booking) => {
    onEdit(booking)
    setBookingConfirmationModal(false)
  }

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleModalClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Grid item container>
          <Grid item style={{ marginRight: 'auto' }}>
            <Typography className={classes.bookingTitle}>
              Booking Details
            </Typography>
            {record && record.status === BOOKING_STATUS.CANCELLED && (
              <Typography className={classes.bookingCancelledTime}>
                {`Cancelled ${moment(
                  convertToDateString(record.last_updated_at),
                ).format('hh:mm A')} ${moment(
                  convertToDateString(record.last_updated_at),
                ).format('ddd MMM DD, YYYY')}`}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Select
              id="status"
              variant="outlined"
              defaultValue={record && record.status}
              value={record && record.status}
              className={classes.detailsStatusSelect}
              onChange={handleStatusChange}
              disabled={true}
              style={{
                backgroundColor:
                  record && record.status === BOOKING_STATUS.PENDING
                    ? '#FFDC88'
                    : record && record.status === BOOKING_STATUS.COMPLETED
                    ? '#70C78D'
                    : record && record.status === BOOKING_STATUS.CONFIRMED
                    ? '#5EA0E0'
                    : record && record.status === BOOKING_STATUS.CANCELLED
                    ? '#FF8888'
                    : record && record.status === BOOKING_STATUS.NO_SHOW
                    ? '#727272'
                    : '#727272',
              }}
              margin="dense"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem
                value={BOOKING_STATUS.PENDING}
                style={{ color: '#FFDC88' }}
              >
                Pending
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.CANCELLED}
                style={{ color: '#FF8888' }}
              >
                Cancelled
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.COMPLETED}
                style={{ color: '#70C78D' }}
              >
                Completed
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.CONFIRMED}
                style={{ color: '#5EA0E0' }}
              >
                Confirmed
              </MenuItem>
              <MenuItem
                value={BOOKING_STATUS.NO_SHOW}
                style={{ color: '#727272' }}
              >
                No-show
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid item container justify="space-between">
          <RenderMemberInfo
            classes={classes}
            record={record}
            onViewProfile={(userId) => {}}
          />
          <RenderReservationDetails
            record={record}
            classes={classes}
            handleDeleteBookingModalOpen={handleDeleteBookingModalOpen}
            handleBookingConfirmModalOpen={handleBookingConfirmModalOpen}
          />
        </Grid>
        <DeleteBookingModal
          deleteBookingModal={deleteBookingModal}
          handleDeleteBookingModalClose={handleDeleteBookingModalClose}
          handleBookingConfirmModalOpen={handleBookingConfirmModalOpen}
          onDeleteBooking={onDeleteBooking}
        />
      </Grid>
      <BookingModal
        bookingModal={bookingConfirmationModal}
        handleBookingModalClose={handleBookingConfirmModalClose}
        bookingItem={record}
        onEditBooking={onEditBooking}
      />
    </Scrollbar>
  )

  return (
    <Modal open={cancelledBookingDetailsModal} onClose={handleModalClose}>
      {body}
    </Modal>
  )
}
