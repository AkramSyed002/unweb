import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import {
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Typography,
  ListItemIcon,
  Box,
  useTheme,
  AppBar,
  Tabs,
  Divider,
  Tab,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import MenuTabs from "../../components/Menu/MenuTabs";
import { useAppContext } from "../../context/AppContext";
import {
  getMenuByRestaurantId,
  getMenuItemsByRestaurantId,
} from "../../firebase/services";
import { useAuth } from "../../context/AuthContext";
import { isItemInArray } from "../../utils/utils";
import { USER_ROLES } from "../../constants";
import OverviewSubTabs from "../../components/Menu/OverviewSubTabs";
import ItemsTab from "../../components/Menu/tabs/ItemsTab";
import ManageItemModal from "../../components/Menu/modals/ManageItemModal";
import LoadingModal from "../../components/members/modals/LoadingModal";
import { MySearchUserList } from "../../components/Menu/MySearchUserList";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  input: {
    flex: 1,
    fontFamily: "Avenir",
    border: "1.5px solid #E4E4E4",
    padding: 10,
    borderRadius: "8px",
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
  grayTitle: {
    color: "#C0C0C0",
    fontWeight: 500,
    fontSize: 13,
    fontFamily: "Avenir",
  },
  title: {
    color: "#353535",
    fontWeight: 700,
    fontSize: 34,
    marginTop: 40,
    marginLeft: 40,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  headerTitle: {
    marginTop: 34,
    color: "#353535",
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "AvenirBold",
  },
  filterTitle: {
    color: "#727272",
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
    border: "none",
  },
  filterLabel: {
    width: "70%",
    fontSize: 16,
    fontWeight: 500,
    color: "#353535",
    cursor: "pointer",
    margin: 5,
  },

  filterMenu: {
    // marginTop: '0em',
    marginLeft: "20%",
    borderRadius: 8,
  },
  filterListItemIcon: {
    minWidth: "35px",
  },
  root: {
    backgroundColor: "#fff",
    width: "95%",
    marginTop: 25,
  },
  tab: {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Avenir",
  },
  todayButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 40,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
  },
  viewButton: {
    marginLeft: "auto",
    color: "#727272",
    width: 90,
    height: 40,
    textTransform: "none",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 500,
    marginRight: 16,
  },
  tabBottomLine: {
    width: "100%",
    height: 5,
    borderRadius: 8,
    marginTop: -5,
  },
  searchTextFieldStyle: {
    alignItems: "center",
    display: "flex",
    width: 335,
    height: 50,
    marginTop: 20,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const RenderHeader = ({
  classes,
  onChangeSearch,
  value,
  showIcon,
  onClick,
  searchText,
}) => (
  <Grid item container alignItems="center">
    <Paper className={classes.searchTextFieldStyle} elevation={0}>
      <InputBase
        value={value}
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={onChangeSearch}
        endAdornment={
          <InputAdornment
            position="end"
            style={{ padding: 5, color: "#5ea0e0", cursor: "pointer" }}
            onClick={onClick}
          >
            {showIcon && searchText.length > 0 ? <CloseIcon /> : null}
          </InputAdornment>
        }
      />
    </Paper>
  </Grid>
);

const RenderFilter = ({
  classes,
  isVisible,
  handleFilterClose,
  data,
  selectedRestaurant,
  getRestaurantMenu,
  getRestaurantMenuItems,
}) => (
  <Menu
    id="filterMenu"
    anchorEl={isVisible}
    keepMounted
    open={Boolean(isVisible)}
    onClose={handleFilterClose}
    elevation={2}
    className={classes.filterMenu}
  >
    {data &&
      data.map((el, i) => (
        <MenuItem
          selected={el.id == selectedRestaurant?.id}
          onClick={() => {
            getRestaurantMenu(el.id);
            getRestaurantMenuItems(el.id);
            handleFilterClose();
          }}
        >
          {el.id == selectedRestaurant?.id ? (
            <ListItemIcon className={classes.filterListItemIcon}>
              <CheckIcon />
            </ListItemIcon>
          ) : (
            <ListItemIcon className={classes.filterListItemIcon}></ListItemIcon>
          )}
          {el.name}
        </MenuItem>
      ))}
  </Menu>
);

const ManageMenu = () => {
  let arrayHolder = [];
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const {
    restaurants,
    setMenu,
    setMenuItems,
    selectedRestaurant,
    setSelectedRestaurant,
    menuItems,
    menu,
  } = useAppContext();

  const [showRestaurants, setShowRestaurants] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEdit, setShowEdit] = useState(null);

  let menuItemArrayHolder = menuItems;
  const [searchedData, setSearchedData] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [showCloseIcon, setShowCloseIcon] = useState(false);

  useEffect(() => {
    if (restaurants.length > 0) {
      getRestaurantMenu(restaurants[0].id);
      getRestaurantMenuItems(restaurants[0].id);
    }
  }, [restaurants]);

  useEffect(() => {
    if (currentUser !== null) {
      setShowEdit(
        isItemInArray(
          [USER_ROLES.ADMIN, USER_ROLES.RESERVATIONS_MANAGER],
          currentUser.role
        )
      );
    }
  }, [currentUser]);

  useEffect(() => {
    arrayHolder = menuItems;
  }, [menuItems]);

  const getRestaurantMenu = async (restaurant_id) => {
    setMenu(null);
    const index = restaurants.findIndex((el) => el.id === restaurant_id);
    setSelectedRestaurant(restaurants[index]);
    const allMenu = await getMenuByRestaurantId(restaurant_id);
    setMenu(allMenu);
  };

  const getRestaurantMenuItems = async (restaurant_id) => {
    const allMenuItems = await getMenuItemsByRestaurantId(restaurant_id);
    console.log("HERE", allMenuItems);
    setMenuItems(allMenuItems);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //handleChange
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setShowCloseIcon(true);
    handleMenuItemDataFiltering(e);
  };

  // //handle Close List
  const handleCloseIcon = () => {
    setShowCloseIcon(false);
    setSearchText("");
  };

  //menuItems filtering
  const handleMenuItemDataFiltering = (event) => {
    const mySearch = event.target.value;
    const newData = menuItemArrayHolder.filter((item) => {
      const itemData = item.item_name.toLowerCase();
      const textData = mySearch.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchedData(newData);
  };

  if (menuItems === null || menu === null)
    return <LoadingModal modalVisible={true} />;

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <Grid item container>
        <RenderHeader
          classes={classes}
          onChangeSearch={handleSearchChange}
          value={searchText}
          showIcon={showCloseIcon}
          onClick={handleCloseIcon}
          searchText={searchText}
        />
        {/* My Search User List */}
        {searchText ? (
          <MySearchUserList
            data={searchedData}
            setSelectedRecord={setSelectedRecord}
          />
        ) : null}
        {/* end */}
      </Grid>
      <Typography className={classes.headerTitle}>
        <span className={classes.grayTitle}>Manage menu</span> <br />
        {selectedRestaurant && selectedRestaurant.name}
      </Typography>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setShowRestaurants(!showRestaurants)}
      >
        <Typography
          color="primary"
          style={{ fontFamily: "Avenir", fontWeight: 700 }}
        >
          Change location
        </Typography>
        <RenderFilter
          classes={classes}
          isVisible={showRestaurants}
          data={restaurants}
          selectedRestaurant={selectedRestaurant}
          handleFilterClose={() => setShowRestaurants(false)}
          getRestaurantMenu={getRestaurantMenu}
          getRestaurantMenuItems={getRestaurantMenuItems}
        />
      </div>
      <>
        <div className={classes.root}>
          <AppBar position="static" color="#fff" elevation={0}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              TabIndicatorProps={{
                style: {
                  height: "5px",
                  borderRadius: 4,
                },
              }}
            >
              <Tab label="Overview" className={classes.tab} {...a11yProps(0)} />
              <Tab label="Items" className={classes.tab} {...a11yProps(1)} />
            </Tabs>
            <Divider light className={classes.tabBottomLine} />
          </AppBar>

          <TabPanel value={value} index={0} dir={theme.direction}>
            <OverviewSubTabs
              showEdit={showEdit}
              menu={menu}
              setMenu={setMenu}
              selectedRestaurant={selectedRestaurant}
            />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ItemsTab
              showEdit={showEdit}
              menuItems={menuItems}
              setSelectedRecord={setSelectedRecord}
            />
          </TabPanel>
          {selectedRecord && (
            <ManageItemModal
              isVisible={selectedRecord ? true : false}
              handleCloseModal={() => setSelectedRecord(null)}
              record={selectedRecord}
              showEdit={showEdit}
            />
          )}
        </div>
      </>
    </Grid>
  );
};

export default ManageMenu;
