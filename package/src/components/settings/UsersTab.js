import React, { Fragment, useState } from 'react'
import {
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Tooltip,
  Switch,
  Chip,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import FilterListIcon from '@material-ui/icons/FilterList'
import { NotificationStatusInitial, USER_ROLES } from '../../constants'
import { useAuth } from '../../context/AuthContext'
import {
  getNotificationStatusesByID,
  updateNotificationStatusesByID,
  updateUserNotificationStatusesByID,
} from '../../firebase/services'
import { useAppContext } from '../../context/AppContext'
import SettingsTabs from './SettingsTabs'
import { SuggestionDropdown } from '../SuggestionDropdown'
import MembersDropdown from '../bookings/MembersDropdown'

const useStyles = makeStyles((theme) => ({
  headerTitle: {
    marginTop: 110,
    marginBottom: 10,
    color: '#353535',
    fontSize: 30,
    fontWeight: 700,
  },
  updateButton: {
    color: '#fff',
    background: '#5EA0E0',
    width: 180,
    height: 32,
    borderRadius: 4,
    marginBottom: 16,
  },
  infoContainer: {
    background: '#F8F8F8',
    borderRadius: 16,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 48,
  },
  credentialTitle: {
    color: '#727272',
    fontSize: 20,
    fontWeight: 500,
  },
  notificationTitle: {
    color: '#353535',
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 16,
    width: '42%',
  },
  divider: {
    // marginTop: 16,
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    // color: '#C0C0C0',
    color: '#000',
    marginBottom: 4,
  },
  textField: {
    width: 334,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    background: '#fff',
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
    // color: '#C0C0C0',
    color: '#000',
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: '#727272',
    color: '#000',
  },
  countryCodeSelect: {
    width: 110,
    background: '#fff',
  },
  notiItem: {
    color: '#727272',
    fontSize: 16,
    fontWeight: 500,
    width: '42%',
  },
  filterIcon: {
    border: '#C0C0C0 solid 1px',
    borderRadius: 4,
    color: '#C0C0C0',
    marginBottom: 5,
  },
}))

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 48,
    height: 23,
    padding: 0,
    border: '2px solid #AECFEF',
    borderRadius: 100,
    marginLeft: 20,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(24px)',
      color: '#5EA0E0',
      '& + $track': {
        backgroundColor: '#5EA0E0',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
    },
  },
  thumb: {
    width: 16,
    height: 16,
    color: '#AECFEF',
  },
  track: {
    borderRadius: 26 / 2,
    background: '#fff',
    opacity: 0.5,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})

const RenderTextField = ({
  classes,
  style,
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onMouseOut,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
      }}
      onChange={onChange}
      onFocus={onFocus}
      onMouseOut={onMouseOut}
    />
  </Grid>
)

export const UsersTab = () => {
  const classes = useStyles()

  const [showSmsNotification, setShowSmsNotification] = useState(false)
  const [showEmailNotification, setShowEmailNotification] = useState(false)
  const [showInAppNotification, setShowInAppNotification] = useState(false)
  const [notificationsStatuses, setNotificationsStatuses] = useState([
    ...NotificationStatusInitial,
  ])
  const [showMembersList, setShowMembersList] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [memberName, setMemberName] = useState('')
  const { members, admins } = useAppContext()

  const [loading, setLoading] = useState(false)
  const [allMembers, setAllMembers] = useState(members)

  const handleNotificationExpand = (e) => {
    switch (e.target.id) {
      case 'sms':
        setShowSmsNotification(!showSmsNotification)
        break
      case 'email':
        setShowEmailNotification(!showEmailNotification)
        break
      case 'inApp':
        setShowInAppNotification(!showInAppNotification)
        break

      default:
        break
    }
  }

  const handleMemberEmailChange = (members) => {
    const membersIds = []

    members.map(({ id }) => membersIds.push(id))

    setSelectedMembers([...membersIds])
  }

  const handleSwitchChange = (i) => {
    let temp = [...notificationsStatuses]
    temp[i].value = !temp[i].value
    setNotificationsStatuses(temp)
  }

  const handleCheckboxChange = (i) => {
    let temp = [...notificationsStatuses]
    temp[i].visibility = !temp[i].visibility
    setNotificationsStatuses(temp)
  }

  const handleNotificationsUpdate = async () => {
    try {
      setLoading(true)
      await updateUserNotificationStatusesByID(
        selectedMembers,
        notificationsStatuses,
      )
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <Grid container>{
      console.log(admins, 'admins')
    }
      <Grid item container direction="column" className={classes.infoContainer}>
        <Fragment>
          <Typography className={classes.credentialTitle}>Members</Typography>
          <Divider light className={classes.divider} />
          {/* Work */}
          <Grid item container>
            <Autocomplete
              id="email"
              options={admins.filter(
                (admin) => admin.email && admin.role == USER_ROLES.ADMIN,
              )}
              getOptionLabel={(option) => option.first_name + ' ' + option.last_name}
              multiple
              limitTags={1}
              style={{ width: 300 }}
              onChange={(_, value) => handleMemberEmailChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="email"
                  label="Select Member"
                  placeholder="Email"
                  variant="outlined"
                  className={classes.textField}
                  style={{ width: 335 }}
                />
              )}
            />
          </Grid>
        </Fragment>
      </Grid>
      <Grid item container direction="column" className={classes.infoContainer}>
        <Grid item container direction="row" justifyContent="space-between">
          <Typography className={classes.notificationTitle}>
            Notifications
          </Typography>
          <Button
            variant="contained"
            className={classes.updateButton}
            onClick={handleNotificationsUpdate}
            disabled={loading}
          >
            Update
          </Button>
        </Grid>
        <Divider light className={classes.divider} />

        {/* Start */}
        <Grid container direction="column" style={{ marginBottom: 60 }}>
          <Grid item container>
            <Typography className={classes.notificationTitle}>
              SMS notifications
            </Typography>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: 'transparent' }}
            >
              <FilterListIcon
                onClick={handleNotificationExpand}
                id={'sms'}
                className={classes.filterIcon}
              />
            </IconButton>
          </Grid>
          {showSmsNotification && (
            <Fragment>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="flex-end"
                style={{ marginBottom: 8, width: '52%' }}
              >
                <Typography
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#C0C0C0',
                    marginRight: 23,
                  }}
                >
                  Visibility
                </Typography>
                <Typography
                  style={{ fontSize: 15, fontWeight: 500, color: '#C0C0C0' }}
                >
                  Value
                </Typography>
              </Grid>
              {notificationsStatuses &&
                notificationsStatuses.map(
                  (el, i) =>
                    el.type === 'sms' && (
                      <Grid
                        key={i.toString()}
                        item
                        container
                        style={{ marginBottom: 8 }}
                      >
                        <Typography className={classes.notiItem}>
                          {el.title}
                        </Typography>
                        <Checkbox
                          checked={el.visibility}
                          onChange={() => handleCheckboxChange(i)}
                          color="primary"
                          style={{ marginTop: -10 }}
                        />
                        <IOSSwitch
                          checked={el.value}
                          onChange={() => handleSwitchChange(i)}
                        />
                      </Grid>
                    ),
                )}
            </Fragment>
          )}
        </Grid>
        {/* Start */}
        <Grid container direction="column" style={{ marginBottom: 60 }}>
          <Grid item container>
            <Typography className={classes.notificationTitle}>
              Email notifications
            </Typography>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: 'transparent' }}
            >
              <FilterListIcon
                onClick={handleNotificationExpand}
                id={'email'}
                className={classes.filterIcon}
              />
            </IconButton>
          </Grid>
          {showEmailNotification && (
            <Fragment>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="flex-end"
                style={{ marginBottom: 8, width: '52%' }}
              >
                <Typography
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#C0C0C0',
                    marginRight: 23,
                  }}
                >
                  Visibility
                </Typography>
                <Typography
                  style={{ fontSize: 15, fontWeight: 500, color: '#C0C0C0' }}
                >
                  Value
                </Typography>
              </Grid>
              {notificationsStatuses &&
                notificationsStatuses.map(
                  (el, i) =>
                    el.type === 'email' && (
                      <Grid
                        key={i.toString()}
                        item
                        container
                        style={{ marginBottom: 8 }}
                      >
                        <Typography className={classes.notiItem}>
                          {el.title}
                        </Typography>
                        <Checkbox
                          checked={el.visibility}
                          onChange={() => handleCheckboxChange(i)}
                          color="primary"
                          style={{ marginTop: -10 }}
                        />
                        <IOSSwitch
                          checked={el.value}
                          onChange={() => handleSwitchChange(i)}
                        />
                      </Grid>
                    ),
                )}
            </Fragment>
          )}
        </Grid>
        {/* Start */}
        <Grid container direction="column" style={{ marginBottom: 60 }}>
          <Grid item container>
            <Typography className={classes.notificationTitle}>
              In App notifications
            </Typography>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: 'transparent' }}
            >
              <FilterListIcon
                onClick={handleNotificationExpand}
                id={'inApp'}
                className={classes.filterIcon}
              />
            </IconButton>
          </Grid>
          {showInAppNotification && (
            <Fragment>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="flex-end"
                style={{ marginBottom: 8, width: '52%' }}
              >
                <Typography
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#C0C0C0',
                    marginRight: 23,
                  }}
                >
                  Visibility
                </Typography>
                <Typography
                  style={{ fontSize: 15, fontWeight: 500, color: '#C0C0C0' }}
                >
                  Value
                </Typography>
              </Grid>
              {notificationsStatuses &&
                notificationsStatuses.map(
                  (el, i) =>
                    el.type === 'in_app' && (
                      <Grid
                        key={i.toString()}
                        item
                        container
                        style={{ marginBottom: 8 }}
                      >
                        <Typography className={classes.notiItem}>
                          {el.title}
                        </Typography>
                        <Checkbox
                          checked={el.visibility}
                          onChange={() => handleCheckboxChange(i)}
                          color="primary"
                          style={{ marginTop: -10 }}
                        />
                        <IOSSwitch
                          checked={el.value}
                          onChange={() => handleSwitchChange(i)}
                        />
                      </Grid>
                    ),
                )}
            </Fragment>
          )}
        </Grid>
        {/* End */}
      </Grid>
    </Grid>
  )
}
