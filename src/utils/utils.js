import moment from "moment";
import { ROUTES } from "../constants/routes";
import parsePhoneNumber from "libphonenumber-js";

export const validateEmail = (emailAdress) => {
  let regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  status5 = null,
  status6 = null
) => {
  if (bookings === null) return [];

  if (status6)
    return bookings.filter(function (booking) {
      return (
        booking.status === status1 ||
        booking.status === status2 ||
        booking.status === status3 ||
        booking.status === status4 ||
        booking.status === status5 ||
        booking.status === status6
      );
    });

  return bookings.filter(function (booking) {
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
};

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

export const formattedDate = (date) => {
  if (date?.seconds ? true : false) {
    return moment(new Date(date.seconds * 1000)).format("DD/MM/YYYY");
  } else {
    return moment(date?.toDate().toDateString()).format("DD/MM/YYYY");
  }
};

export const formattedDateForCVS = (date) => {
  if (date === "" || date === undefined) return "";
  if (date?.seconds ? true : false) {
    return moment(new Date(date.seconds * 1000)).format("DD/MM/YYYY");
  }
  return date;
};

export const generateRandomPassword = (count) => {
  const letter =
    "0123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ0123456789abcdefghiABCDEFGHIJKLMNOPQRST0123456789jklmnopqrstuvwxyz";
  let randomString = "";
  for (let i = 0; i < count; i++) {
    const randomStringNumber = Math.floor(
      1 + Math.random() * (letter.length - 1)
    );
    randomString += letter.substring(
      randomStringNumber,
      randomStringNumber + 1
    );
  }
  return randomString;
};

export const convertToTime = (date) => {
  if (date === null) return null;

  if (!date)
    return `${new Date().getHours().toString()}:${new Date()
      .getMinutes()
      .toString()}`;

  return `${new Date(date).getHours().toString()}:${new Date(date)
    .getMinutes()
    .toString()}`;
};

export const removeDuplicateFromArray = (arr, key) => {
  const filteredArr = arr.reduce((acc, current) => {
    const x = acc.find((item) => item[key] === current[key]);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  let temp = [];
  filteredArr.map((el) => temp.push(el[key]));
  return temp;
};

var phoneRegex =
  /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const formattedPhoneNumber = (phoneNumber) =>
  phoneNumber?.replace(phoneRegex, "($1) $2-$3");

export const createRandomRGBA = () => {
  let o = Math.round;
  let r = Math.random;
  let s = 255;
  return o(r() * s) + "," + o(r() * s) + "," + o(r() * s);
};

export const getPhoneAndCountryCode = (phone_number) => {
  if (
    phone_number === null ||
    phone_number === undefined ||
    phone_number === "" ||
    phone_number === "+" ||
    phone_number === "1" ||
    phone_number === "+1"
  )
    return { countryCode: "", number: "" };

  const phoneNumber = parsePhoneNumber(phone_number);
  return {
    countryCode: phoneNumber.countryCallingCode,
    number: phoneNumber.nationalNumber,
  };
};

export const convertIntoPhoneNumber = (phone_number) => {
  const { countryCode, number } = getPhoneAndCountryCode(phone_number);
  return `+${countryCode}${number}`;
};
