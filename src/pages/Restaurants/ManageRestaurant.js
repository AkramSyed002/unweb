import React, { Fragment, useState, useEffect } from "react";
import { Grid, Typography, Button, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import countryList from "react-select-country-list";

import { ROUTES } from "../../constants/routes";
import { BasicInfo } from "../../components/restaurants/ManageRestaurant/BasicInfo";
import { AddressInfo } from "../../components/restaurants/ManageRestaurant/AddressInfo";
import { ImagesInfo } from "../../components/restaurants/ManageRestaurant/ImagesInfo";
import { DescriptionFeatureInfo } from "../../components/restaurants/ManageRestaurant/DescriptionFeatureInfo";
import { HoursOperationInfo } from "../../components/restaurants/ManageRestaurant/HoursOperationInfo";
import { BlackoutDatesInfo } from "../../components/restaurants/ManageRestaurant/BlackoutDatesInfo";
import { SocialLinksInfo } from "../../components/restaurants/ManageRestaurant/SocialLinksInfo";
import { BookingConfirmation } from "../../components/restaurants/ManageRestaurant/BookingConfirmation";
import {
  CollectionNames,
  OpenHoursOptions,
  RestaurantInitialData,
  USER_ROLES,
} from "../../constants";
import _ from "lodash";

import {
  convertTo24Hour,
  getDaysArray,
  isTimeInArray,
} from "../../utils/utils";
import {
  addNewRestaurant,
  updateFirestoreDocument,
  uploadImagesToStorage,
  getFeatureOptions,
  sendNotificationToAllUsers,
  sendNotificationToAllMembers,
} from "../../firebase/services";
import { getServerTime } from "../../firebase/firebase";
import { useAppContext } from "../../context/AppContext";
import AlertModal from "../../components/members/modals/AlertModal";
import { useAuth } from "../../context/AuthContext";
import LoadingModal from "../../components/members/modals/LoadingModal";
import LeavePageBlocker from "../../components/LeavePageBlocker";

const ManageRestaurant = () => {
  const { restaurants, setRestaurants } = useAppContext();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { currentUser } = useAuth();

  const isViewMode = location.state ? true : false;

  const [updateConfirmModal, setUpdateConfirmModal] = useState(false);
  const [cancelConfirmModal, setCancelConfirmModal] = useState(false);

  const [countryCode, setCountryCode] = useState("usa");
  const [appOptions, setAppOptions] = useState([]);

  const [restaurant, setRestaurant] = useState(
    location.state
      ? Object.assign({}, location.state.restaurant)
      : {
          name: "",
          type: ["permanent"],
          email: "",
          contact: "",
          country: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          postal_code: "",
          imageURL: [],
          features: [],
          description: [],
          hours_open: OpenHoursOptions,
          is_temporarily_closed: false,
          blackout_dates: [],
          social_links: [{ type: "Facebook", link: "" }],
          booking_confirmations: [{ type: "default", description: "" }],
        }
  );

  // let initialRestaurantTempCloseCheck = location.state ? location.state.restaurant.is_temporarily_closed : null;

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarAlertText, setSnackbarAlertText] = useState(
    "Restaurant successfully added!"
  );

  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (location.state && _.isEqual(restaurant, location.state.restaurant))
      setDirty(false);
    else if (
      _.isEqual(restaurant, {
        name: "",
        type: "permanent",
        email: "",
        contact: "",
        country: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        imageURL: [],
        features: [],
        description: [],
        hours_open: OpenHoursOptions,
        is_temporarily_closed: false,
        blackout_dates: [],
        social_links: [{ type: "Facebook", link: "" }],
        booking_confirmations: [{ type: "default", description: "" }],
      })
    )
      setDirty(false);
    else setDirty(true);
  }, [restaurant]);

  useEffect(() => {
    async function initAppOptions() {
      const app_options_snapshot = await getFeatureOptions();
      setAppOptions(app_options_snapshot.data()?.values);
    }
    initAppOptions();
  }, []);

  const handleInputChange = (name, value) => {
    setRestaurant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onImageSelect = (file, index) => {
    restaurant.imageURL[index] = file;
    handleInputChange("imageURL", restaurant.imageURL);
  };

  const onImageDelete = (index) => {
    restaurant.imageURL.splice(index, 1);
    handleInputChange("imageURL", restaurant.imageURL);
  };

  const handleDescriptionChange = (desc) => {
    if (desc === "") return;
    restaurant.description.push(desc);
    handleInputChange("description", restaurant.description);
  };

  const handleDescriptionDelete = (index) => {
    restaurant.description.splice(index, 1);
    handleInputChange("description", restaurant.description);
  };

  const handleFeatureDelete = (index) => {
    restaurant.features.splice(index, 1);
    handleInputChange("features", restaurant.features);
  };

  const handleDayCheck = (index) => {
    restaurant.hours_open[index].is_closed =
      !restaurant.hours_open[index].is_closed;
    handleInputChange("hours_open", restaurant.hours_open);
  };

  const handleDayTime = (timeValue, key, index, objKey) => {
    const time = convertTo24Hour(timeValue);
    let tempHoursOpen = restaurant.hours_open[index];
    if (tempHoursOpen.type === "Add B/L/D") {
      tempHoursOpen = {
        ...tempHoursOpen,
        [objKey]: {
          start: key === "start" ? time : tempHoursOpen[objKey].start,
          end: key === "end" ? time : tempHoursOpen[objKey].end,
        },
      };
    } else {
      tempHoursOpen = {
        ...tempHoursOpen,
        start: key === "start" ? time : tempHoursOpen.start,
        end: key === "end" ? time : tempHoursOpen.end,
      };
    }

    restaurant.hours_open[index] = tempHoursOpen;
    handleInputChange("hours_open", restaurant.hours_open);
  };

  const handleDayTypeChange = (value, index) => {
    let tempHoursOpen = restaurant.hours_open[index];
    if (value === "Add B/L/D") {
      tempHoursOpen = {
        day: tempHoursOpen.day,
        breakfast: null,
        lunch: null,
        dinner: null,
        type: value,
      };
    } else {
      tempHoursOpen = {
        day: tempHoursOpen.day,
        start: 1000,
        end: 2200,
        type: value,
      };
    }
    restaurant.hours_open[index] = tempHoursOpen;
    handleInputChange("hours_open", restaurant.hours_open);
  };

  const toggleItemMealSlot = (key, value, index) => {
    let tempHoursOpen = restaurant.hours_open[index];
    if (value === true) {
      tempHoursOpen[key] = { start: 1000, end: 2200 };
    } else {
      tempHoursOpen[key] = null;
    }

    restaurant.hours_open[index] = tempHoursOpen;
    handleInputChange("hours_open", restaurant.hours_open);
  };

  const addMealSlot = (index) => {
    restaurant.hours_open[index]["Add other"] = null;
    handleInputChange("hours_open", restaurant.hours_open);
  };

  const changeMealSlotName = (value, index) => {
    delete restaurant.hours_open[index]["Add other"];
    restaurant.hours_open[index][value] = { start: 1000, end: 2200 };
    handleInputChange("hours_open", restaurant.hours_open);
  };

  const handleTempCloseDate = () => {
    handleInputChange(
      "is_temporarily_closed",
      !restaurant.is_temporarily_closed
    );
  };

  const handleAddBlackoutDate = (startDate, endDate) => {
    const datesArray = getDaysArray(startDate, endDate);
    datesArray.map((el) => {
      if (!isTimeInArray(restaurant.blackout_dates, el)) {
        restaurant.blackout_dates.push(el);
      }
    });
    handleInputChange("blackout_dates", restaurant.blackout_dates);
  };

  const handleDeleteBlackoutDate = (index) => {
    restaurant.blackout_dates.splice(index, 1);
    handleInputChange("blackout_dates", restaurant.blackout_dates);
  };

  const handleSocialInputChange = (key, value, index) => {
    restaurant.social_links[index][key] = value;
    handleInputChange("social_links", restaurant.social_links);
  };

  const handleAddSocialLink = () => {
    handleInputChange("social_links", [
      ...restaurant.social_links,
      { type: "Facebook", link: "" },
    ]);
  };

  const handleDeleteSocialLink = (index) => {
    restaurant.social_links.splice(index, 1);
    handleInputChange("social_links", restaurant.social_links);
  };

  const addBookingSlot = () => {
    restaurant.booking_confirmations.push({ type: "", description: "" });
    handleInputChange(
      "booking_confirmations",
      restaurant.booking_confirmations
    );
  };

  const onBookingTextChange = (key, value, index) => {
    if (key === "type") restaurant.booking_confirmations[index].type = value;
    else restaurant.booking_confirmations[index].description = value;
    handleInputChange(
      "booking_confirmations",
      restaurant.booking_confirmations
    );
  };

  const savePress = async () => {
    try {
      setLoading(true);
      if (restaurant.imageURL.length > 0) {
        const imageUrlLink = await uploadImagesToStorage(restaurant.imageURL);
        restaurant.imageURL = imageUrlLink;
      }

      restaurant.created_at = getServerTime();
      const { id } = await addNewRestaurant(restaurant);
      setSnackbarAlertText("Restaurant Successfully Added!");
      sendNotificationToAllUsers(
        "restaurant_created",
        `has created a new restaurant ${restaurant.name}`,
        id
      );
      setSnackbarVisible(true);
      setLoading(false);
      const temp = [...restaurants];
      restaurant.id = id;
      temp.push(restaurant);
      setRestaurants(temp);
      confirmCancel();
    } catch (error) {
      console.log("Error adding restaurant", error);
    }
  };

  const updatePress = async () => {
    setLoading(true);
    setUpdateConfirmModal(false);
    // separate file photos from array
    const files = restaurant.imageURL.filter((obj) => {
      return typeof obj === "object";
    });

    try {
      // Upload new files selected
      if (files.length > 0) {
        // Get existing urls from array, // we separated urls / files.
        const urls = restaurant.imageURL.filter((obj) => {
          return typeof obj === "string";
        });
        const imageUrlLink = await uploadImagesToStorage(files);
        restaurant.imageURL = [...urls, ...imageUrlLink];
      }

      await updateFirestoreDocument(CollectionNames.RESTAURANTS, restaurant);
      // if (restaurant.is_temporarily_closed) {
      //   sendNotificationToAllUsers(
      //     "restaurant",
      //     `has closed ${restaurant.name}`,
      //     restaurant.id
      //   );
      //   if (initialRestaurantTempCloseCheck !== restaurant.is_temporarily_closed) {
      //     sendNotificationToAllMembers(
      //       'Restaurant temporary closed',
      //       'restaurant',
      //       `We sorry to inform you that ${restaurant.name} has temporary closed for essential maintenance works/ lockdown etc. Please contact the team for further information `,
      //       restaurant.id
      //     );
      //   }
      // }
      sendNotificationToAllUsers(
        "restaurant_updated",
        `has made changes to ${restaurant.name} details`,
        restaurant.id
      );
      setSnackbarAlertText("Restaurant Successfully Updated!");
      setSnackbarVisible(true);
      setLoading(false);
      const temp = [...restaurants];
      const index = temp.findIndex((el) => el.id === restaurant.id);
      temp[index] = restaurant;
      setRestaurants(temp);
    } catch (error) {
      console.log("Error Updating Restaurant", error);
    }
  };

  const confirmCancel = async () => {
    setRestaurant({
      name: "",
      type: "permanent",
      email: "",
      contact: "",
      country: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      imageURL: [],
      features: [],
      description: [],
      hours_open: OpenHoursOptions,
      is_temporarily_closed: false,
      blackout_dates: [],
      social_links: [{ type: "Facebook", link: "" }],
      booking_confirmations: [{ type: "default", description: "" }],
    });
    setCancelConfirmModal(false);
    history.push("/dashboard/manage-restaurants");
  };

  const canMakeChanges = () => currentUser.role === USER_ROLES.ADMIN;

  if (restaurant === null || currentUser === null || loading)
    return <LoadingModal modalVisible={true} />;

  return (
    <>
      <LeavePageBlocker when={dirty} />
      <Snackbar
        open={snackbarVisible}
        autoHideDuration={6000}
        onClose={() => setSnackbarVisible(false)}
      >
        <MuiAlert onClose={() => setSnackbarVisible(false)} severity="success">
          {snackbarAlertText}
        </MuiAlert>
      </Snackbar>
      <Grid container className={classes.mainContainer}>
        <Typography className={classes.title}>
          {isViewMode ? restaurant.name : "Add new restaurant"}
        </Typography>
        <Grid item container justify="flex-end" alignItems="center">
          <Button
            variant="text"
            className={classes.cancelButton}
            onClick={() =>
              canMakeChanges() ? setCancelConfirmModal(true) : confirmCancel()
            }
            disabled={loading}
            disableElevation
          >
            Cancel
          </Button>
          {canMakeChanges() && (
            <Button
              disableElevation
              disabled={loading}
              // disabled={(() => {
              //   if (
              //     restaurant.name == "" ||
              //     restaurant.contact == "" ||
              //     restaurant.country == "" ||
              //     restaurant.address_line_1 == "" ||
              //     restaurant.city == "" ||
              //     restaurant.state == "" ||
              //     loading
              //   ) {
              //     return true;
              //   } else {
              //     return false;
              //   }
              // })()}
              onClick={
                isViewMode ? () => setUpdateConfirmModal(true) : savePress
              }
              variant="contained"
              className={classes.saveButton}
            >
              {isViewMode ? "Update" : "Save"}
            </Button>
          )}
        </Grid>
        <Grid
          item
          container
          direction="column"
          className={classes.infoContainer}
        >
          <BasicInfo
            classes={classes}
            state={restaurant}
            handleInputChange={handleInputChange}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            disableInput={!canMakeChanges()}
          />
          <AddressInfo
            classes={classes}
            state={restaurant}
            handleInputChange={handleInputChange}
            disableInput={!canMakeChanges()}
          />

          <ImagesInfo
            classes={classes}
            onSelect={onImageSelect}
            images={restaurant.imageURL}
            deleteImage={onImageDelete}
            disableInput={!canMakeChanges()}
          />
          <div style={{ marginTop: 50 }}></div>

          <DescriptionFeatureInfo
            classes={classes}
            features={restaurant.features}
            appOptions={appOptions}
            description={restaurant.description}
            handleInputChange={handleInputChange}
            handleFeatureDelete={handleFeatureDelete}
            onDescriptionChange={handleDescriptionChange}
            handleDescriptionDelete={handleDescriptionDelete}
            disableInput={!canMakeChanges()}
          />
          <HoursOperationInfo
            classes={classes}
            hoursOpen={restaurant.hours_open}
            temporaryClosed={restaurant.is_temporarily_closed}
            handleDayCheck={handleDayCheck}
            handleDayTime={handleDayTime}
            onTemporarilyCloseChange={handleTempCloseDate}
            handleDayTypeChange={handleDayTypeChange}
            toggleItemMealSlot={toggleItemMealSlot}
            addMealSlot={addMealSlot}
            changeMealSlotName={changeMealSlotName}
            disableInput={!canMakeChanges()}
          />

          <BlackoutDatesInfo
            classes={classes}
            dates={restaurant.blackout_dates}
            onAddDate={handleAddBlackoutDate}
            onDeleteDate={handleDeleteBlackoutDate}
            disableInput={!canMakeChanges()}
          />
          <BookingConfirmation
            classes={classes}
            items={restaurant.booking_confirmations}
            addBookingSlot={addBookingSlot}
            onBookingTextChange={onBookingTextChange}
            disableInput={!canMakeChanges()}
          />
          <SocialLinksInfo
            classes={classes}
            history={history}
            socialLinks={restaurant.social_links}
            handleInputChange={handleSocialInputChange}
            onAddList={handleAddSocialLink}
            onDeleteList={handleDeleteSocialLink}
            disableInput={!canMakeChanges()}
          />
          <Grid item container justify="flex-end">
            <Button
              variant="text"
              className={classes.cancelButton}
              onClick={() =>
                canMakeChanges() ? setCancelConfirmModal(true) : confirmCancel()
              }
              disabled={loading}
              disableElevation
            >
              Cancel
            </Button>
            {canMakeChanges() && (
              <Button
                disableElevation
                // disabled={(() => {
                //   if (
                //     restaurant.name == "" ||
                //     restaurant.contact == "" ||
                //     restaurant.country == "" ||
                //     restaurant.address_line_1 == "" ||
                //     restaurant.city == "" ||
                //     restaurant.state == "" ||
                //     loading
                //   ) {
                //     return true;
                //   } else {
                //     return false;
                //   }
                // })()}
                onClick={
                  isViewMode ? () => setUpdateConfirmModal(true) : savePress
                }
                variant="contained"
                className={classes.saveButton}
                disabled={loading}
              >
                {isViewMode ? "Update" : "Save"}
              </Button>
            )}
          </Grid>
        </Grid>
        <AlertModal
          description={"Are you sure you want to update this record "}
          informative
          onConfirmClick={updatePress}
          handleClose={() => setUpdateConfirmModal(false)}
          modalVisible={updateConfirmModal}
          btnText="Yes, update it"
        />
        <AlertModal
          description={
            "Are you sure you want to cancel? All changes will be lost"
          }
          onConfirmClick={confirmCancel}
          handleClose={() => setCancelConfirmModal(false)}
          modalVisible={cancelConfirmModal}
          btnText="Yes"
          btn2Text="No"
        />
      </Grid>
    </>
  );
};

export default ManageRestaurant;
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 263,
    paddingRight: 40,
  },
  title: {
    marginTop: 110,
    color: "#353535",
    fontSize: 30,
    fontWeight: 700,
    fontFamily: "AvenirBold",
  },
  saveButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    borderRadius: 4,
    marginLeft: 5,
    textTransform: "none",
    fontFamily: "Avenir",
  },
  removeButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 120,
    height: 32,
    borderRadius: 4,
    padding: 16,
    marginLeft: 5,
  },
  cancelButton: {
    color: "#C0C0C0",
    fontWeight: 600,
    fontSize: 16,
    textTransform: "none",
    paddingRight: 16,
    fontFamily: "Avenir",
    height: 33,
  },
  infoContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    padding: 40,
    marginBottom: 48,
    marginTop: 16,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 500,
    // color: '#353535',
    color: "#000",
    marginBottom: 16,
    fontFamily: "Avenir",
  },
  textField: {
    width: 334,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    background: "#fff",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
    color: "#000",
  },
  textFieldText: {
    fontSize: 16,
    fontWeight: 700,
    // color: '#C0C0C0',
    color: "#000",
    fontFamily: "Avenir",
  },
  // HERE
  label: {
    marginTop: 10,
    color: "#C0C0C0",
    padding: "10px 0 10px 0",
    fontSize: 15,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  dayLabel: {
    marginTop: 16,
    color: "#353535",
    marginBottom: 4,
    fontWeight: 500,
    fontSize: 16,
    width: 52,
  },
  dottedButton: {
    width: 176,
    height: 55,
    border: "#C0C0C0 dashed 2px",
    marginLeft: 25,
    marginTop: 8,
    color: "#C0C0C0",
    textTransform: "none",
  },
  dinnerButton: {
    width: 176,
    height: 55,
    marginLeft: 25,
    marginTop: 8,
    textTransform: "none",
    background: "#fff",
    border: "#E4E4E4 solid 1px",
    color: "#727272",
  },
  timeRangeTextfield: {
    width: 107,
    height: 55,
    marginTop: 8,
    textTransform: "none",
    background: "#fff",
    color: "#727272",
  },
  addMealSlotButton: {
    width: 176,
    height: 52,
    background: "#5EA0E0",
    color: "#fff",
    textTransform: "none",
    fontWeight: 700,
    fontSize: 16,
  },
  blueTickIcon: {
    marginLeft: "3.5em",
    color: "#fff",
    background: "#5EA0E0",
    borderRadius: 4,
  },
  timeTextFiled: {
    width: 107,
    marginTop: 8,
    background: "#fff",
    // marginLeft: 9,
  },
  locationStatusSelect: {
    width: 229,
    height: 32,
    marginLeft: 16,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 12,
    color: "#fff",
  },
  countryCodeSelect: {
    width: 110,
    borderRadius: 8,
    marginBottom: 9,
    background: "#fff",
  },
  socialLinkSelect: {
    width: 176,
    borderRadius: 8,
    marginBottom: 9,
    background: "#fff",
  },
  imageContainer: {
    width: 200,
    height: 200,
    border: "#C0C0C0 dashed 2px",
    borderRadius: 8,
    marginRight: 8,
  },
  listItem: {
    color: "#727272",
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 8,
    fontFamily: "Avenir",
  },
  deleteButton: {
    color: "#5EA0E0",
    marginLeft: "auto",
    textTransform: "none",
    fontWeight: 500,
    fontSize: 16,
    marginLeft: 10,
  },
  addPlateformButton: {
    color: "#5EA0E0",
    textTransform: "none",
    fontSize: 16,
    fontWeight: 700,
    marginLeft: 16,
    marginTop: 50,
  },
  closeRestCheckbox: {
    fontWeight: 500,
    fontSize: 13,
    marginLeft: 128,
    marginTop: -10,
  },
  closeRestaurant: {
    fontWeight: 500,
    fontSize: 16,
  },
  chip: {
    borderRadius: 8,
    marginRight: 8,
  },
}));
