import React, { useState, Fragment } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  Typography,
  Modal,
  Button,
  Grid,
  Divider,
  Fab,
  TextField,
  Checkbox,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  Chip,
} from '@material-ui/core'

import { Scrollbar } from 'react-scrollbars-custom'

import CloseIcon from '@material-ui/icons/Close'
import AlertModal from '../../members/modals/AlertModal'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 820,
    backgroundColor: theme.palette.background.paper,
    padding: '0px 40px 18px 40px',
    top: 18,
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
    marginTop: -15,
    fontFamily: 'Avenir',
  },
  subTitle: {
    color: '#353535',
    fontSize: 22,
    fontWeight: 700,
    marginTop: 20,
    fontFamily: 'Avenir',
  },
  saveButton: {
    fontWeight: 600,
    fontSize: 18,
    background: '#5EA0E0',
    color: '#fff',
    textAlign: 'center',
    width: 335,
    height: 52,
    fontFamily: 'Avenir',
    textTransform: ' none',
    '&:hover': {
      color: '#727272',
    },
  },
  cancelButton: {
    fontWeight: 600,
    fontSize: 18,
    textAlign: 'center',
    width: 335,
    height: 52,
    textTransform: ' none',
    border: '2px solid #727272',
    marginRight: 32,
    fontFamily: 'Avenir',
  },
  textField: {
    width: 334,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    background: '#fff',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
    fontFamily: 'Avenir',
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#353535',
    fontFamily: 'Avenir',
  },
  fabButton: {
    marginTop: -15,
    marginRight: -60,
    background: '#1D244D',
    color: '#fff',
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 18,
    color: '#C0C0C0',
    fontFamily: 'Avenir',
  },
  checkboxLabel: {
    fontWeight: 700,
    fontSize: 16,
    color: '#353535',
  },
  deleteSelected: {
    color: '#FF8888',
    fontSize: 16,
    fontWeight: 700,
    marginLeft: 'auto',
    cursor: 'pointer',
  },
  table: {
    background: '#F8F8F8',
  },
  locationContainer: {
    width: 300,
    height: 150,
    border: '1px solid #C0C0C0',
    borderRadius: 4,
    background: '#fff',
    padding: 16,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButtonStyle: {
    textTransform: 'none',
    fontFamily: 'Avenir',
    fontSize: 16,
    color: 'red',
  },
}))

const RenderTextField = ({
  classes,
  style,
  label,
  id,
  placeholder,
  value,
  indorment,
  onChange,
}) => (
  <Grid item container direction="column" style={style}>
    <label className={classes.label}>{label}</label>
    <TextField
      onChange={onChange}
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
        startAdornment: indorment,
      }}
    />
  </Grid>
)

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: '#C0C0C0',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'Avenir',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    // boxShadow: '0px 4px 32px rgba(0, 0, 0, 0.08)',
  },
}))(TableRow)

export default function ManageSuperCatModal({
  menuModal,
  handleClose,
  categoryName,
  onChange,
  onAddCategory,
  loading,
  error,
  isUpdate,
  handleDelete,
}) {
  const classes = useStyles()

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const body = (
    <Scrollbar style={{ height: 740 }}>
      <AlertModal
        modalVisible={showConfirmModal}
        description={'Are you sure you want to delete this menu?'}
        handleClose={() => setShowConfirmModal(false)}
        onConfirmClick={() => {
          setShowConfirmModal(false)
          handleDelete()
        }}
      />
      <Grid container direction="column" className={classes.paper}>
        <Grid item container alignItems="flex-start" justify="flex-end">
          <Fab
            aria-label="add"
            elevation={0}
            onClick={handleClose}
            className={classes.fabButton}
          >
            <CloseIcon />
          </Fab>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Typography className={classes.bookingTitle}>
            {!isUpdate ? 'Add new category' : 'Update category'}
          </Typography>

          {isUpdate && (
            <Button
              onClick={() => setShowConfirmModal(true)}
              endIcon={<CloseIcon color="error" />}
              className={classes.deleteButtonStyle}
            >
              Delete category
            </Button>
          )}
        </Grid>

        <Divider light />

        <RenderTextField
          classes={classes}
          style={{ width: 335, marginLeft: 16 }}
          label="Category name"
          placeholder="Enter category name..."
          value={categoryName}
          onChange={onChange}
        />
        <Typography color="error" style={{ marginLeft: 16 }}>
          {error}
        </Typography>

        <Grid item container justify="center" style={{ marginTop: 20 }}>
          <Button onClick={handleClose} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button
            disabled={loading || !categoryName}
            onClick={onAddCategory}
            className={classes.saveButton}
          >
            {!isUpdate ? 'Add' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </Scrollbar>
  )

  return (
    <Modal open={menuModal} onClose={handleClose}>
      {body}
    </Modal>
  )
}
