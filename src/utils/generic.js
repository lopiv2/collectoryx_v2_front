import { Context } from "../components/Wrapper";
import { useContext } from "react";
import OptionsService from "../components/DropDownOptions";
import { createTheme } from "@mui/material/styles";
import { green, blue } from "@mui/material/colors";
import esLocale from "date-fns/locale/es";
import enLocale from "date-fns/locale/en-US";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import NoImage from "../images/no-photo-available.png";

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
            //height: "100%",
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
            //height: "100%",
          },
        },
      },
    },
  });
  return currTheme;
};

const CurrencyChecker = () => {
  const context = useContext(Context);
  //console.log(context.locale)
  const res = OptionsService.countriesOptions.find(
    (locale) => locale.value === context.locale
  );
  return res;
};

const FeatureForImplement = () => {
  toast.error(
    <FormattedMessage id="app.feature_for_implement"></FormattedMessage>,
    { theme: "colored" }
  );
};

const GetLocaleDateTime = () => {
  const context = useContext(Context);
  return context;
};

const SetLocaleDateTime = () => {
  const context = useContext(Context);
  switch (context.locale) {
    case "es-ES":
      return esLocale;
    case "en-US":
      return enLocale;
    default:
      return enLocale;
  }
};

const CheckCountFieldNameApi = (response, selectedApi, rowsPerPage) => {
  if (
    selectedApi.name.includes("Pokemon") ||
    selectedApi.name.includes("Marvel Legends") ||
    selectedApi.name.includes("Minerals") ||
    selectedApi.name.includes("MOTU") ||
    selectedApi.name.includes("Gijoe") ||
    selectedApi.name.includes("Star Wars") ||
    selectedApi.name.includes("TMNT") ||
    selectedApi.name.includes("DC Multiverse") ||
    selectedApi.name.includes("Hot Wheels")
  ) {
    return Math.ceil(response.data.totalCount / rowsPerPage);
  }
  if (selectedApi.name.includes("Rebrickable")) {
    return Math.ceil(response.data.count / rowsPerPage);
  }
  if (selectedApi.name.includes("GiantBomb")) {
    return Math.ceil(response.data.number_of_total_results / rowsPerPage);
  }
};

const CheckLatestVersionInstalled = (version, latestVersion) => {
  if (latestVersion !== "") {
    if (latestVersion?.includes(version)) {
      return true;
    } else {
      return false;
    }
  }
};

const FilterResultsByApiProvider = (results, selectedApi, collection) => {
  var items = [];
  if (selectedApi.name.includes("Pokemon")) {
    if (results.data) {
      //console.log(results.data);
      results.data.map((item, index) =>
        items.push({
          name: item.name,
          image: item.images.large ? item.images.large : NoImage,
          collection: collection,
          year: new Date(item.set.releaseDate).getFullYear(),
          serie: item.set.series,
          own: false,
          price: item.tcgplayer
            ? item.tcgplayer.prices
              ? item.tcgplayer.prices.normal
                ? item.tcgplayer.prices.normal.mid
                : 0.0
              : 0.0
            : 0.0,
        })
      );
      return items;
    }
    return null;
  }
  if (selectedApi.name.includes("GiantBomb")) {
    if (results.results) {
      //console.log(results);
      results.results.map((item, index) =>
        items.push({
          name: item.name,
          image: item.image.original_url ? item.image.original_url : NoImage,
          collection: collection,
          year: new Date(item.original_release_date).getFullYear(),
          serie: null,
          own: false,
          price: 0.0,
          metadata: [
            {
              name: "platform",
              type: "STRING",
              value: item.platforms !== null ? item.platforms[0].name : "",
            },
            {
              name: "developer",
              type: "STRING",
              value:
                item.developers !== undefined ? item.developers[0].name : "",
            },
            {
              name: "genre",
              type: "STRING",
              value: item.genres !== undefined ? item.genres[0].name : "",
            },
          ],
        })
      );
      //console.log(items);
      return items;
    }
    return null;
  }
  if (selectedApi.name.includes("Rebrickable")) {
    if (results.results) {
      results.results.map((item, index) =>
        items.push({
          name: item.name,
          image: item.set_img_url ? item.set_img_url : NoImage,
          collection: collection,
          year: item.year,
          serie: item.theme_id,
          own: false,
          price: 0.0,
          metadata: [
            {
              name: "number_id",
              type: "STRING",
              value: item.set_num !== null ? item.set_num : "",
            },
            {
              name: "inventory",
              type: "STRING",
              value: item.num_parts !== undefined ? item.num_parts : "",
            },
          ],
        })
      );
      return items;
    }
  }
  if (
    selectedApi.name.includes("Marvel Legends") ||
    selectedApi.name.includes("Minerals") ||
    selectedApi.name.includes("MOTU") ||
    selectedApi.name.includes("Gijoe") ||
    selectedApi.name.includes("Star Wars") ||
    selectedApi.name.includes("TMNT") ||
    selectedApi.name.includes("Hot Wheels") ||
    selectedApi.name.includes("DC Multiverse")
  ) {
    if (results.items) {
      results.items.map((item, index) =>
        items.push({
          name: item.name,
          image: item.image.path ? item.image.path : NoImage,
          collection: collection,
          year: item.year,
          serie: item.serie.name,
          own: false,
          price: item.price,
          metadata: item.metadata ?? item.metadata,
        })
      );
      //console.log(items)
      return items;
    }
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
  CheckCountFieldNameApi,
  CheckLatestVersionInstalled,
  FeatureForImplement,
  FilterResultsByApiProvider,
  GetCurrencySymbolLocale,
  getFromLocalStorage,
  getImagePaths,
  GetLocaleDateTime,
  SetLocaleDateTime,
  setToLocalStorage,
};
