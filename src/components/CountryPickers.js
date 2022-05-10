import React from "react";
import { Input, MenuItem } from "@material-ui/core";
import Select from "react-select";
import { makeStyles } from "@material-ui/styles";
import countryList from "react-select-country-list";
import { el } from "date-fns/locale";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: 334,
    height: 60,
    borderColor: "#E4E4E4",
    borderRadius: 5,
    background: "#fff",
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 700,
    color: "#0000",
    fontFamily: "Avenir",
    menu: (base) => ({
      ...base,
      fontFamily: "Avenir",
      color: "#0000",
      fontWeight: 700,
    }),
  }),
};

export const CountryPickers = ({
  // variant,
  placeholder,
  value,
  onChange,
  disabled
}) => {
  const countryNames = countryList().getData();

  const getValueFromCountryList = (item) => {
    return countryNames.map((el) => {
      if (el.label === item) return el;
    });
  };
  return (
    <>
      <Select
        isDisabled={disabled}
        placeholder={placeholder}
        options={countryNames}
        value={getValueFromCountryList(value)}
        onChange={onChange}
        styles={{
          control: (base) => ({
            ...base,
            fontFamily: "Avenir",
            width: 334,
            height: 60,
            borderColor: "#E4E4E4",
            borderRadius: 5,
            background: "#fff",
            fontSize: 16,
            marginBottom: 4,
            fontWeight: 700,
            color: "#0000",
          }),
          menu: (base) => ({
            ...base,
            fontFamily: "Avenir",
            width: 334,
            fontSize: 16,
            fontWeight: 500,
          }),
        }}
      />
    </>
  );
};
