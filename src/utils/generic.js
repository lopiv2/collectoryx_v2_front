import { Context } from "../components/Wrapper";
import React, { useState, useEffect, useContext } from "react";
import OptionsService from "../components/DropDownOptions";

const CurrencyChecker = () => {
  const context = useContext(Context);
  const res = OptionsService.countriesOptions.find(
    (locale) => locale.value === context.locale
  );
  return res;
};


export { CurrencyChecker };
