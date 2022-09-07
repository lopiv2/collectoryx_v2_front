import { Context } from "../components/Wrapper";
import { useContext } from "react";
import OptionsService from "../components/DropDownOptions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, blue, grey } from "@mui/material/colors";
//import axios from "axios";

const cleanUrl = (url) => {
  let cleanedUrl = url.includes("https")
    ? url.slice(8)
    : url.includes("http") && url.slice(7);
  cleanedUrl = cleanedUrl.includes("/") ? cleanedUrl.split("/")[0] : cleanedUrl;
  return cleanedUrl;
};

const CreateTheme = (userData) => {
  const currTheme = createTheme({
    palette: {
      mode: userData.theme.mode,
      primary: {
        main: userData.theme.topBarColor, //Barra top
        light: "#42a5f5",
        dark: blue[50],
        contrastText: "#000000",
      },
      secondary: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: green[50],
        contrastText: "#fff",
      },
      text: {
        primary: userData.theme.primaryTextColor, //Texto primario
        secondary: userData.theme.secondaryTextColor, //Texto Secundario
        disabled: green[50],
      },
      background: {
        paper: userData.theme.sideBarColor, //Barra lateral y cartas
        default: green[50],
      },
    },
    components: {
      MuiContainer: {
        //Sobreescribe el estilo del contenedor
        styleOverrides: {
          root: {
            backgroundColor: userData.theme.backgroundColor,
            backgroundImage: "url(" + userData.theme.backgroundImage + ")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%",
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: userData.theme.listItemColor,
            paddingTop: "6px",
            paddingBottom: "6px",
          },
        },
      },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            backgroundColor: userData.theme.backgroundColor,
            //backgroundImage: "url(" + userData.theme.backgroundImage + ")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%",
          },
        },
      },
    },
  });
  return currTheme;
};

const CurrencyChecker = () => {
  const context = useContext(Context);
  const res = OptionsService.countriesOptions.find(
    (locale) => locale.value === context.locale
  );
  return res;
};

const FilterResultsByApiProvider = (results, selectedApi, collection) => {
  var items = [];
  if (selectedApi.name.includes("Pokemon")) {
    if (results.data) {
      console.log(results.data);
      results.data.map((item, index) =>
        items.push({
          name: item.name,
          image: item.images.large,
          collection: collection,
          serie: item.set.series,
          price: item.tcgplayer.prices.normal ? item.tcgplayer.prices.normal.mid : 0.0,
        })
      );
      return items;
    }
    return null;
  }
  return null;
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

const getFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
};

function getImagePaths(directory) {
  let images = [];
  directory.keys().map((item, index) => images.push(item.replace("./", "")));
  return images;
}

const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export {
  cleanUrl,
  CreateTheme,
  CurrencyChecker,
  FilterResultsByApiProvider,
  GetCurrencySymbolLocale,
  getFromLocalStorage,
  getImagePaths,
  setToLocalStorage,
};
