import React, { useState, useEffect, useRef } from "react";
import { Grid, Typography, Button, Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";

import { generateActivationPin, isItemInArray } from "../../utils/utils";
import { CollectionNames, MemberInitialData } from "../../constants";
import { SuggestionDropdown } from "../../components/SuggestionDropdown";
import { useAppContext } from "../../context/AppContext";
import {
  addNewMember,
  findUsedAccessCode,
  getAccessCodes,
  updateFirestoreDocument,
  uploadSingleImage,
  getTagOptions,
  getAllergiesOptions,
  getDietaryOptions,
  addOptionTag,
  addAllergiesOption,
  addDietaryOption,
  sendNotificationToAllUsers,
} from "../../firebase/services";
import { SnackbarAlert } from "../../components/SnackbarAlert";
import { ROUTES } from "../../constants/routes";

import { RenderBasicInfo } from "../../components/members/ManageMembers/RenderBasicInfo";
import { RenderContactInfo } from "../../components/members/ManageMembers/RenderContactInfo";
import { RenderAddressInfo } from "../../components/members/ManageMembers/RenderAddressInfo";
import { RenderMarketingPreferences } from "../../components/members/ManageMembers/RenderMarketingPreferences";
import { RenderActivationPin } from "../../components/members/ManageMembers/RenderActivationPin";
import { useAuth } from "../../context/AuthContext";
import AlertModal from "../../components/members/modals/AlertModal";

const ManageMember = () => {
  const { restaurants } = useAppContext();
  const { currentUser } = useAuth();

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { members, setMembers } = useAppContext();

  const isViewMode = location.state ? true : false;

  const [updateConfirmModal, setUpdateConfirmModal] = useState(false);
  const [cancelConfirmModal, setCancelConfirmModal] = useState(false);

  const [countryCode, setCountryCode] = useState("usa");
  const [tagOptions, setTagsOptions] = useState([]);
  const [allergiesOptions, setAllergiesOptions] = useState([]);
  const [dietaryOptions, setDietaryOptions] = useState([]);
  const [member, setMember] = useState(
    location.state
      ? Object.assign(MemberInitialData, location.state.member)
      : MemberInitialData
  );
  const [globalLocations, setGlobalLocations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState(
    "Member has been successfully created."
  );
  const profileImageRef = useRef();

  useEffect(() => {
    getPinCode();
    let temp = [];
    restaurants.map((el) => temp.push(el.name));
    setGlobalLocations(temp);
  }, []);

  useEffect(() => {
    async function initAppOptions() {
      const tags_options_snapshot = await getTagOptions();
      const allergies_options_snapshot = await getAllergiesOptions();
      const dietary_options_snapshot = await getDietaryOptions();
      setTagsOptions(tags_options_snapshot.data()?.values);
      setAllergiesOptions(allergies_options_snapshot.data()?.values);
      setDietaryOptions(dietary_options_snapshot.data()?.values);
    }
    initAppOptions();
  }, []);

  const getPinCode = async () => {
    let pin_code = "";
    if (!isViewMode) {
      const usedCodeSnap = await findUsedAccessCode();
      if (!usedCodeSnap.empty) {
        usedCodeSnap.forEach((doc) => setPinCode(doc.id));
      } else {
        pin_code = generateActivationPin();
        // Get All Access_Codes to cross check new generated code
        let access_codes = await getAccessCodes();
        while (isItemInArray(access_codes, pinCode)) {
          pin_code = generateActivationPin();
        }
        setPinCode(pin_code);
      }
    }
  };

  const handleInputChange = (name, value) => {
    if (name == "global_locations") {
      const restaurants = [];
      value.map((restaurant) => restaurants.push(restaurant));
      setMember({ ...member, [name]: restaurants });
      return;
    }
    setMember((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagChange = (tags) => {
    const newTags = tags.map(({ label }) => label);

    setMember((prevState) => ({
      ...prevState,
      tags: newTags,
    }));
  };

  const onCreateTag = async (label, color) => {
    if (!label) return;
    const isExist = tagOptions.find(
      ({ label: tag }) =>
        String(tag).toLowerCase() == String(label).toLowerCase()
    );
    if (!isExist) {
      await addOptionTag([...tagOptions, { label, color }]);
    }
  };

  const onDeleteTag = async (index) => {
    const tags = tagOptions.filter((_, indx) => index !== indx);
    await addOptionTag(tags);
  };

  const handleAllergiesChange = (allergies) => {
    const newAllergies = allergies.map(({ label }) => label);

    setMember((prevState) => ({
      ...prevState,
      allergies: newAllergies,
    }));
  };

  const onCreateAllergies = async (label, color) => {
    if (!label) return;
    const isExist = allergiesOptions.find(
      ({ label: tag }) =>
        String(tag).toLowerCase() == String(label).toLowerCase()
    );
    console.log(
      [...allergiesOptions, { label, color }],
      "[...allergiesOptions, { label, color }]"
    );
    if (!isExist)
      await addAllergiesOption([...allergiesOptions, { label, color }]);
  };

  const onDeleteAllergies = async (index) => {
    const allergies = allergiesOptions.filter((_, indx) => index !== indx);
    await addAllergiesOption(allergies);
  };

  const handleDietaryChange = (dietary) => {
    const newDietary = dietary.map(({ label }) => label);

    setMember((prevState) => ({
      ...prevState,
      dietary_requirements: newDietary,
    }));
  };

  const onCreateDietary = async (label, color) => {
    if (!label) return;
    const isExist = dietaryOptions.find(
      ({ label: tag }) =>
        String(tag).toLowerCase() == String(label).toLowerCase()
    );
    if (!isExist) await addDietaryOption([...dietaryOptions, { label, color }]);
  };

  const onDeleteDietary = async (index) => {
    const dietary = dietaryOptions.filter((_, indx) => index !== indx);
    await addDietaryOption(dietary);
  };

  const onAddGlobalLocation = (location) => {
    if (location === "") return;
    if (!member.global_locations.includes(location)) {
      member.global_locations.push(location);
      handleInputChange("global_locations", member.global_locations);
    }
  };

  const onDeleteGlobalLocation = (index) => {
    member.global_locations.splice(index, 1);
    handleInputChange("global_locations", member.global_locations);
  };

  const onRefSelect = () => {
    profileImageRef.current.click();
  };

  const onImageSelect = (file) => {
    member.profile_image_URL = file;
    handleInputChange("profile_image_URL", member.profile_image_URL);
  };

  const savePress = async () => {
    try {
      member.created_at = new Date();
      setLoading(true);
      if (member.profile_image_URL) {
        const downloadImageUrl = await uploadSingleImage(
          member.profile_image_URL
        );
        member.profile_image_URL = downloadImageUrl;
      }

      const result = await addNewMember(member, pinCode);
      if (result.status === false) {
        setLoading(false);
        return alert(result.message);
      }
      member.id = result.uid;
      let temp = [...members];
      temp.push(member);
      setMembers(temp);
      setSnackbarVisible(true);
      setLoading(false);
      sendNotificationToAllUsers(
        "member_profile_created",
        `has created ${member.first_name} ${member.last_name} profile`,
        member.id
      );
      history.push({
        pathname: ROUTES.MEMBER_VIEW,
        state: { member },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmUpdate = async () => {
    try {
      setLoading(true);
      if (
        member.profile_image_URL &&
        typeof member.profile_image_URL === "object"
      ) {
        const downloadImageUrl = await uploadSingleImage(
          member.profile_image_URL
        );
        member.profile_image_URL = downloadImageUrl;
      }
      await updateFirestoreDocument(CollectionNames.USERS, member);
      sendNotificationToAllUsers(
        "member_profile_update",
        `made changes to ${member.first_name} ${member.last_name} profile`,
        member.id
      );
      setSnackbarText("Member Successfully Updated!");
      setSnackbarVisible(true);
      setLoading(false);
      const temp = [...members];
      const index = temp.findIndex((el) => el.id === member.id);
      temp[index] = member;
      setMembers(temp);
      setUpdateConfirmModal(false);
    } catch (error) {
      console.log("Error Updating Member", error);
    }
  };

  const confirmCancel = async () => {
    setCancelConfirmModal(false);
    history.push({
      pathname: "/dashboard/member-profile",
      state: { user: member },
    });
  };

  return (
    <Grid container className={classes.mainContainer}>
      <SnackbarAlert
        visible={snackbarVisible}
        onClose={() => setSnackbarVisible(false)}
        text={snackbarText}
      />

      <Typography className={classes.headerTitle}>
        {isViewMode ? "Edit Member" : "Add New Member"}
      </Typography>
      <Grid item container justify="flex-end">
        {/* <IconButton onClick={handleBack}>
          <strong>←</strong>
        </IconButton> */}
        <Box>
          <Button
            disabled={loading}
            variant="text"
            className={classes.cancelButton}
            onClick={() => setCancelConfirmModal(true)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={isViewMode ? () => setUpdateConfirmModal(true) : savePress}
            variant="contained"
            className={classes.saveButton}
          >
            {isViewMode ? "Update" : "Save"}
          </Button>
        </Box>
      </Grid>
      <Grid item container direction="column" className={classes.infoContainer}>
        <RenderActivationPin classes={classes} pinCode={pinCode} />
        <RenderBasicInfo
          classes={classes}
          member={member}
          appOptions={tagOptions}
          allergiesOptions={allergiesOptions}
          dietaryOptions={dietaryOptions}
          restaurants={restaurants}
          handleInputChange={handleInputChange}
          onCreateTag={onCreateTag}
          onDeleteTag={onDeleteTag}
          onTagChange={handleTagChange}
          onCreateAllergies={onCreateAllergies}
          onDeleteAllergies={onDeleteAllergies}
          onAllergiesChange={handleAllergiesChange}
          onCreateDietary={onCreateDietary}
          onDeleteDietary={onDeleteDietary}
          onDietaryChange={handleDietaryChange}
          globalLocationsOptions={globalLocations}
          onAddGlobalLocation={onAddGlobalLocation}
          onDeleteGlobalLocation={onDeleteGlobalLocation}
          onRefSelect={onRefSelect}
          onSelect={onImageSelect}
          profileImage={member.profile_image_URL}
          profileImageRef={profileImageRef}
          isViewMode={isViewMode}
        />
        <RenderContactInfo
          classes={classes}
          countryCode={countryCode}
          member={member}
          handleInputChange={handleInputChange}
          disabledEmail={isViewMode}
        />
        <RenderAddressInfo
          classes={classes}
          member={member}
          handleInputChange={handleInputChange}
        />
        <RenderMarketingPreferences
          classes={classes}
          handleInputChange={handleInputChange}
          member={member}
        />
      </Grid>
      <Grid item container justify="flex-end" alignItems="flex-start">
        <Button
          disabled={loading}
          onClick={isViewMode ? () => setUpdateConfirmModal(true) : savePress}
          variant="contained"
          className={classes.saveButtonBottom}
        >
          {isViewMode ? "Update" : "Save"}
        </Button>
      </Grid>
      <AlertModal
        description={"Are you sure you want to update this member profile"}
        informative
        onConfirmClick={confirmUpdate}
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
  );
};

export default ManageMember;
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: 240,
    paddingRight: 40,
  },
  headerTitle: {
    marginTop: 40,
    color: "#353535",
    fontSize: 34,
    fontWeight: 700,
    // marginLeft: -50,
    fontFamily: " Avenir",
    fontStyle: "normal",
  },
  saveButton: {
    color: "#fff",
    background: "#5EA0E0",
    width: 90,
    height: 32,
    borderRadius: 4,
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 16,
  },
  cancelButton: {
    color: "#C0C0C0",
    fontWeight: 700,
    fontSize: 16,
    textTransform: "none",
    paddingRight: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  infoContainer: {
    background: "#F8F8F8",
    borderRadius: 16,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#353535",
    marginBottom: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: "#353535",
    marginBottom: 16,
    fontFamily: "Avenir",
    fontStyle: "normal",
  },
  pinCode: {
    fontSize: 32,
    fontWeight: 700,
    color: "#353535",
    fontFamily: "Avenir",
    fontStyle: "normal",
    lineHeight: 38,
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
    // color: "#727272",
    fontFamily: "Avenir",
    fontStyle: "normal",
    color: "#000",
  },
  label: {
    marginTop: 16,
    color: "#C0C0C0",
    // color: "#000",
    marginBottom: 4,
    fontFamily: "Avenir",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 13,
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
  dinnerTextField: {
    width: 176,
    height: 55,
    marginTop: 8,
    textTransform: "none",
    background: "#fff",
    // color: "#727272",
    color: "#000",
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
    marginLeft: 9,
    color: "#000",
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
    width: 135,
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
  },
  deleteButton: {
    color: "#5EA0E0",
    marginLeft: "auto",
    textTransform: "none",
    fontWeight: 500,
    fontSize: 16,
  },
  saveButtonBottom: {
    color: "#fff",
    background: "#5EA0E0",
    width: 335,
    height: 55,
    borderRadius: 4,
    marginBottom: 100,
  },
  pinContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "28%",
    marginTop: 12,
  },
  pinBlock: {
    height: 70,
    width: 50,
    backgroundColor: "white",
    border: "1px solid gray",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
