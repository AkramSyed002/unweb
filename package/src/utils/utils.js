import { ROUTES } from "../constants/routes";

export const validateEmail = (emailAdress) => {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true;
  } else {
    return false;
  }
};

export const getPRSuccessMessage = (value) =>
  value === ROUTES.AUTH_SEND_RESET_PASSWORD
    ? "We have e-mailed password reset link"
    : "You have successfully reset your password. Use your new password when logging in.";

export const getImageUrl = (file) => {
  if (typeof file === "object") return `url(${URL.createObjectURL(file)})`;
  return `url(${file})`;
};

export const convertFrom24Hour = (time) => {
  let timeString = time.toString();
  let timestamp = new Date();
  let hours = "";
  let minutes = "";

  if (timeString.length === 4) {
    hours = timeString.slice(0, 2);
    minutes = timeString.slice(2, 4);
  } else {
    hours = timeString.slice(0, 1);
    minutes = timeString.slice(1, 3);
  }

  timestamp.setHours(parseInt(hours));
  timestamp.setMinutes(parseInt(minutes));
  return timestamp;
};

export const convertTo24Hour = (time) => {
  var options = { hour12: false };
  let timestamp = time.toLocaleTimeString("en-US", options);
  timestamp = timestamp.split(":");
  timestamp = timestamp[0] + timestamp[1];
  return parseInt(timestamp);
};

export const formatDate = (value) => {
  let date;
  if (value.seconds !== undefined) {
    date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
  } else date = new Date(value);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.toLocaleString("default", { year: "numeric" });
  return day + " " + month + " " + year;
};

export const convertToDateString = (value) => {
  if (!value) return "";
  if (value.seconds !== undefined) {
    return new Date(
      value.seconds * 1000 + value.nanoseconds / 1000000
    ).getTime();
  } else return value;
};

export const getDaysArray = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate < new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  dateArray.push(new Date(endDate));
  return dateArray;
};

export const generateActivationPin = () => {
  let code = "";
  for (var i = 0; i < 5; i++) {
    var theRandomNumber = Math.floor(Math.random() * 5) + 1;
    code += theRandomNumber;
  }
  return code;
};

export const isTimeInArray = (array, value) => {
  return !!array.find((item) => {
    return item.getTime() == value.getTime();
  });
};

export const isItemInArray = (array, value) => {
  return !!array.find((item) => {
    return item == value;
  });
};

export const getArrayByStatus = (
  bookings,
  status1,
  status2 = null,
  status3 = null,
  status4 = null,
  status5 = null
) =>
  bookings.filter(function (booking) {
    if (!status2 && !status3) return booking.status === status1;
    else if (!status3)
      return booking.status === status1 || booking.status === status2;
    else if (!status4) {
      return (
        booking.status === status1 ||
        booking.status === status2 ||
        booking.status === status3
      );
    } else {
      return (
        booking.status === status1 ||
        booking.status === status2 ||
        booking.status === status3 ||
        booking.status === status4 ||
        booking.status === status5
      );
    }
  });

export const sortByAlphabet = (array, key) => {
  array.sort((a, b) => a[key].localeCompare(b[key]));
  return array;
};

export const getRestaurantsInfoByIDs = (array, ids) => {
  let temp = [];
  array.map((el) => {
    if (ids.includes(el.id)) temp.push({ name: el.name, id: el.id });
  });
  return temp;
};
