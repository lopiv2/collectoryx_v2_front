import { Context } from "../components/Wrapper";
import { useContext } from "react";
import OptionsService from "../components/DropDownOptions";
//import axios from "axios";

const CurrencyChecker = () => {
  const context = useContext(Context);
  const res = OptionsService.countriesOptions.find(
    (locale) => locale.value === context.locale
  );
  return res;
};

const GetCurrencySymbolLocale = () => {
  const res = CurrencyChecker();
  const currency = res.currency;
  const locale = res.value;
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
};

function getImagePaths(directory) {
  let images = [];
  directory.keys().map((item, index) => images.push(item.replace("./", "")));
  return images;
}

const cleanUrl = (url) => {
  let cleanedUrl = url.includes("https")
    ? url.slice(8)
    : url.includes("http") && url.slice(7);
  cleanedUrl = cleanedUrl.includes("/") ? cleanedUrl.split("/")[0] : cleanedUrl;
  return cleanedUrl;
};

export { cleanUrl, CurrencyChecker, GetCurrencySymbolLocale, getImagePaths };
