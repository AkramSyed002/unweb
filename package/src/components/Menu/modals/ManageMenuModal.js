import React, { useState, Fragment, useEffect } from 'react'
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
import { useAppContext } from '../../../context/AppContext'
import { SuggestionDropdown } from '../../SuggestionDropdown'
import {
  addMenuSubCategory,
  deleteMenuItemsFromCategory,
  updateMenuSubCategory,
} from '../../../firebase/services'

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
    fontSize: 25,
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
    color: '#1665D8',
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
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 4,
    fontFamily: 'Avenir',
  },
  textFieldText: {
    fontSize: 18,
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
    marginTop: 16,
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
    fontFamily: 'Avenir',
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
}))

const RenderTextFieled = ({
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
      id={id}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className={classes.textField}
      InputProps={{
        className: classes.textFieldText,
        startAdornment: indorment,
      }}
      onChange={onChange}
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
    boxShadow: '0px 4px 32px rgba(0, 0, 0, 0.08)',
  },
}))(TableRow)

let toBeDeletedMenuItems = []

export default function ManageMenuModal({
  editMenuModal,
  handleCloseModal,
  selectedMenu,
  currentMenuTabTitle, // if add new is select and we can just get the current selected tab title
}) {
  const classes = useStyles()
  const [menuItemsData, setMenuItemsData] = useState(null)
  const [selectedMenuTitle, setSelectedMenuTitle] = useState('')
  const { menu, setMenu, restaurants, selectedRestaurant } = useAppContext()
  // This is list of all restaurants
  const [globalLocations, setGlobalLocations] = useState(null)
  // This is for dropdown
  const [selectedLocations, setSelectedLocations] = useState(null)
  // This is to keep restaurants which we are going to add
  const [selectedRestaurants, setSelectedRestaurants] = useState(null)
  // Section Sub Category
  const [subCategory, setSubCategory] = useState('')
  // Saves Index of to be deleted menu items
  let deletedItemsIndexes = []
  // Menu Items
  const [menuItems, setMenuItems] = useState([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedMenu) {
      setMenuItemsData(selectedMenu)
      var result = selectedMenu.menu_items.map((v) => ({
        ...v,
        isSelected: false,
      }))
      setMenuItems(result)
      setSelectedMenuTitle(getMenuTitleByID(selectedMenu.super_category_id))
      setSubCategory(selectedMenu.title)
    } else {
      setSelectedMenuTitle(getMenuTitleByTitle(currentMenuTabTitle))
    }
  }, [selectedMenu])

  useEffect(() => {
    let temp = []
    restaurants.map((el) => temp.push(el.name))
    setGlobalLocations(temp)
    temp = []
    temp.push(selectedRestaurant.name)
    setSelectedLocations(temp)
    temp = []
    temp.push({ id: selectedRestaurant.id, name: selectedRestaurant.name })
    setSelectedRestaurants(temp)
  }, [])

  const handleClose = () => {
    toBeDeletedMenuItems = []
    setSubCategory('')
    setSelectedMenuTitle('')
    setMenuItemsData(null)
    handleCloseModal()
  }

  const getMenuTitleByID = (id) => {
    if (!id) return ''
    let index = menu.findIndex((el) => el.id == id)
    return { title: menu[index].title, id: menu[index].id }
  }

  const getMenuTitleByTitle = (title) => {
    if (!title) return ''
    let index = menu.findIndex((el) => el.title === title)
    return { title: menu[index].title, id: menu[index].id }
  }

  const onAddGlobalLocation = (value) => {
    if (!selectedLocations.includes(value)) {
      let temp = [...selectedLocations]
      temp.push(value)
      setSelectedLocations(temp)
      let index = restaurants.findIndex((el) => el.name === value)
      temp = [...selectedRestaurants]
      temp.push({
        id: restaurants[index].id,
        name: restaurants[index].name,
      })
    }
  }

  const onDeleteGlobalLocation = () => {}

  const saveCategory = async () => {
    let temp = [...menu]
    let index = temp.findIndex((el) => el.id === selectedMenuTitle.id)
    // Cannot add same name sub categories
    let hasTitleMenu = temp[index].menu_categories.some(
      (el) => el.title === subCategory,
    )

    if (!hasTitleMenu) {
      try {
        setLoading(true)
        let subCategoryObj = {
          title: subCategory,
          menu_items: [],
          super_category_id: selectedMenuTitle.id,
        }

        const { id } = await addMenuSubCategory(
          selectedMenuTitle.id,
          subCategoryObj,
        )
        subCategoryObj.id = id
        temp[index].menu_categories.push(subCategoryObj)

        setMenu(temp)

        setLoading(false)
        handleClose()
      } catch (error) {
        setLoading(false)
        console.log('Error adding sub category', error.message)
        handleClose()
      }
    } else {
      alert('Category name already exists')
    }
  }

  const updateCategory = async () => {
    let temp = [...menu]
    let index = temp.findIndex((el) => el.id === selectedMenuTitle.id)
    // Cannot add same name sub categories
    let tempMenuItems = []
    menuItems.map((el) => {
      tempMenuItems.push(el.menu_item_id)
    })
    let subCategoryObj = {
      title: subCategory,
      menu_items: tempMenuItems,
      super_category_id: selectedMenuTitle.id,
    }

    // update firestore
    try {
      setLoading(true)
      await updateMenuSubCategory(
        selectedMenuTitle.id, // Super Category ID/ Menu
        menuItemsData.id, //Category ID / Sub Category
        subCategoryObj,
      )
      await deleteMenuItemsFromCategory(toBeDeletedMenuItems)

      subCategoryObj = {
        title: subCategory,
        menu_items: menuItems,
        super_category_id: selectedMenuTitle.id,
      }
      let subIndex = temp[index].menu_categories.findIndex(
        (el) => el.id === menuItemsData.id,
      )
      temp[index].menu_categories[subIndex] = subCategoryObj
      setMenu(temp)
      setLoading(false)
      handleClose()
    } catch (error) {
      setLoading(false)
      console.log('Error updating sub category', error.message)
      handleClose()
    }
  }

  const manageDeleteMenu = (index) => {
    let temp = [...menuItems]
    temp[index].isSelected = !temp[index].isSelected
    setMenuItems(temp)
  }

  const deleteMenuItems = () => {
    let temp = [...menuItems]
    let tempDeletedItems = [...menuItems]
    temp = temp.filter(function (obj) {
      return obj.isSelected === false
    })
    toBeDeletedMenuItems = tempDeletedItems.filter(function (obj) {
      return obj.isSelected === true
    })
    setMenuItems(temp)
  }

  const body = (
    <Scrollbar style={{ height: 740 }}>
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
        <Typography className={classes.bookingTitle}>
          {selectedMenu ? 'Edit' : 'Add'} Menu
        </Typography>
        <Typography className={classes.subTitle}>
          Category Information
        </Typography>
        <Divider light />

        <Grid item container>
          <Grid item container direction="column" style={{ width: 335 }}>
            <label className={classes.label}>CATEGORY</label>
            <Select
              disabled={true}
              id="category"
              variant="outlined"
              placeholder="CATEGORY"
              className={classes.textField}
              value={selectedMenuTitle.title}
              InputProps={{
                className: classes.textFieldText,
              }}
              onChange={({ target }) =>
                setSelectedMenuTitle(getMenuTitleByTitle(target.value))
              }
            >
              {menu &&
                menu.map((el) => (
                  <MenuItem key={el.id} value={el.title}>
                    {el.title}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335, marginLeft: 16 }}
            label="SECTION"
            id="sectionHeading"
            placeholder="SECTION"
            onChange={({ target }) => setSubCategory(target.value)}
            value={subCategory}
          />
        </Grid>

        {/* <RenderTextFieled
          classes={classes}
          label="SECTION SUB HEADING"
          id="sectionSubHeading"
        /> */}

        {selectedMenu && (
          <>
            <Grid item container style={{ marginTop: 20 }}>
              <Typography className={classes.subTitle}>Items</Typography>
              <div onClick={deleteMenuItems}>
                <Typography className={classes.deleteSelected}>
                  Delete Selected
                </Typography>
              </div>
            </Grid>
            <Divider light style={{ marginBottom: 20 }} />

            <Scrollbar style={{ height: 250 }}>
              <TableContainer>
                <Table className={classes.table}>
                  <TableBody>
                    {menuItems &&
                      menuItems.map((row, index) => (
                        <Fragment>
                          <StyledTableRow
                            key={index}
                            // onClick={() => setSelectedRecord(row)}
                            style={{ cursor: 'pointer' }}
                          >
                            <StyledTableCell
                              component="th"
                              scope="row"
                              className={classes.restName}
                            >
                              <Checkbox
                                checked={row.isSelected}
                                color="primary"
                                onClick={() => manageDeleteMenu(index)}
                              />
                              {row.item_name}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: 150 }}
                              className={classes.subName}
                            >
                              {row.price}
                            </StyledTableCell>
                            <StyledTableCell
                              className={
                                (classes.subName, classes.rightBorderRadius)
                              }
                            >
                              {row.tags &&
                                row.tags.map((tag, index) => (
                                  <span key={index} style={{color: `rgb(${tag?.color})`}}>{tag?.label}</span>
                                ))}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </>
        )}

        {/* <Typography className={classes.subTitle}>Select Location</Typography>
        <Divider light /> */}
        {/* <SuggestionDropdown
          dropdownOnly
          options={globalLocations}
          title="Search Locations"
          selectedItems={selectedLocations}
          onItemChange={onAddGlobalLocation}
          onItemDelete={onDeleteGlobalLocation}
        /> */}
        {/* <Grid item container>
          <RenderTextFieled
            classes={classes}
            style={{ width: 335 }}
            label="SEARCH LOCATION"
            id="sectionSubHeading"
            placeholder="SEARCH LOCATION"
          />
          <Grid
            item
            container
            alignItems="flex-end"
            style={{ width: "50%", marginLeft: 16, marginBottom: 8 }}
          >
            <Chip label="Boston" onDelete={() => {}} className={classes.chip} />
            <Chip
              label="New York"
              onDelete={() => {}}
              className={classes.chip}
            />
            <Chip label="Miami" onDelete={() => {}} className={classes.chip} />
          </Grid>
        </Grid>

        <Grid className={classes.locationContainer}>
          <Typography
            style={{
              color: "#C0C0C0",
              fontWeight: 500,
              fontSize: 13,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Select
          </Typography>
          <Grid item container direction="column" style={{ width: 120 }}>
            {restaurants &&
              restaurants.map((el) => (
                <Chip
                  key={el.id}
                  label={el.name}
                  style={{ marginBottom: 8, borderRadius: 4 }}
                />
              ))}
          </Grid>
        </Grid> */}

        <Grid item container justify="center" style={{ marginTop: 20 }}>
          <Button
            disabled={loading}
            onClick={handleClose}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !subCategory}
            onClick={!selectedMenu ? saveCategory : updateCategory}
            className={classes.saveButton}
          >
            {!selectedMenu ? 'Save' : 'Update'} Changes
          </Button>
        </Grid>
      </Grid>
    </Scrollbar>
  )

  return (
    <Modal open={editMenuModal} onClose={handleClose}>
      {body}
    </Modal>
  )
}
