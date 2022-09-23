import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;
const GET_COLLECTION_ITEMS_ID_URL = `${API_URL}/collections`;
const GET_RECENT_COLLECTION_ITEMS_ID_URL = `${API_URL}/collections/recent`;
const COUNT_COLLECTIONS_URL = (id) => `${API_URL}/count-collections/${id}`;
const COUNT_COLLECTIONS_ITEMS_URL = (id) =>
  `${API_URL}/count-collections-items/${id}`;
const COUNT_COLLECTIONS_MONEY_URL = (id) =>
  `${API_URL}/count-collections-money/${id}`;
const COUNT_COLLECTIONS_WISHLIST_URL = (id) =>
  `${API_URL}/count-collections-wishlist/${id}`;
const COUNT_COMPLETED_COLLECTIONS_URL = (id) => `${API_URL}/count-completed-collections/${id}`;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;
const CREATE_ITEM_URL = `${API_URL}/create-item`;
const CREATE_SERIE_URL = `${API_URL}/create-serie`;
const CREATE_FEED_URL = `${API_URL}/feeds/create-feed`;
const DELETE_FEED_ID_URL = (id) => `${API_URL}/feeds/delete-feed/${id}`;
const DELETE_SERIE_ID_URL = (id) => `${API_URL}/delete-serie/${id}`;
const DELETE_COLLECTION_ITEM_ID_URL = (id) =>
  `${API_URL}/delete-collection-item/${id}`;
const DELETE_COLLECTION_ID_URL = (id) => `${API_URL}/delete-collection/${id}`;
const DELETE_COLLECTION_ID_URL_CASCADE = (id) =>
  `${API_URL}/delete-collection-cascade/${id}`;
const GET_COLLECTION_ITEM_ID_URL = (id) => `${API_URL}/get-item/${id}`;
const GET_COLLECTION_ITEMS_YEAR_ID_URL = (id) =>
  `${API_URL}/get-items-per-year/${id}`;
const GET_COLLECTION_ID_URL = (id) => `${API_URL}/get-collection/${id}`;
const MOST_VALUABLE_ITEM_URL = (id) => `${API_URL}/most-valuable-item/${id}`;
const GET_IMAGES_QUERY_URL = (query) =>
  `${API_URL}/marvel/item-images/${query}`;
const GET_COLLECTION_METADATAS_URL = (id) =>
  `${API_URL}/get-metadata-fields/${id}`;
const GET_ITEM_WEB_QUERY_URL = `${API_URL}/scrapper/get-item-from-api/`;
const IMPORT_ITEM_WEB_URL = `${API_URL}/create-item-new-serie`;
const IMAGES_URL = `${API_URL}/images`;
const GET_LOCAL_IMAGES_URL = `${API_URL}/images/get-images-local`;
const FILE_URL = `${API_URL}/import-file`;
const FILE_PARSE_URL = `${API_URL}/parse-file`;
const TOGGLE_COLLECTION_AMBIT_URL = `${API_URL}/toggle-collection-ambit`;
const TOGGLE_COLLECTION_ITEM_OWN_URL = `${API_URL}/toggle-item-own`;
const TOGGLE_COLLECTION_ITEM_WISH_URL = `${API_URL}/toggle-item-wish`;
const UPDATE_ITEM_URL = `${API_URL}/update-item`;
const UPDATE_SERIE_URL = `${API_URL}/update-serie`;
const VIEW_COLLECTIONS_URL = (id) => `${API_URL}/view-collections/${id}`;
const VIEW_SERIES_URL = (id) => `${API_URL}/view-series/${id}`;
const CREATE_THEMES_URL = `${API_URL}/config/create-theme/`;
const VIEW_THEMES_URL = `${API_URL}/config/get-themes/`;
const VIEW_APIS_URL = (id) => `${API_URL}/config/get-api-list/${id}`;
const CREATE_API_URL = `${API_URL}/config/create-api`;
const UPDATE_API_URL = `${API_URL}/config/update-api`;
const DELETE_API_ID_URL = (id) => `${API_URL}/config/delete-api/${id}`;
const CONFIG_URL = (id) => `${API_URL}/config/get-config/${id}`;
const POST_APPEARANCE_CONFIG = `${API_URL}/config/save`;
const VIEW_FEEDS_URL = (id) => `${API_URL}/feeds/view/${id}`;
const UPDATE_FEED_URL = `${API_URL}/feeds/update`;
const VIEW_FEEDS_READ_URL = (id) => `${API_URL}/feeds/get-all/${id}`;
const VIEW_FEEDS_READ_URL_ID = (id, title) =>
  `${API_URL}/feeds/get-feeds/${id}/${title}`;
const VIEW_COLLECTION_SERIES_URL = (id) =>
  `${API_URL}/view-collection-series/${id}`;

const countCollectionsMoney = (id) => {
  return axios
    .get(COUNT_COLLECTIONS_MONEY_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const countCollectionsWishlist = (id) => {
  return axios
    .get(COUNT_COLLECTIONS_WISHLIST_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const countCollections = (id) => {
  return axios
    .get(COUNT_COLLECTIONS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response.data;
    });
};

const countCollectionsItems = (id) => {
  return axios
    .get(COUNT_COLLECTIONS_ITEMS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response.data;
    });
};

const countCompletedCollections = (id) => {
  return axios
    .get(COUNT_COMPLETED_COLLECTIONS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response.data;
    });
};

const createApi = (userId, header, name, apiLink, keyCode, logo) => {
  const data = {
    userId: userId,
    header: header,
    name: name,
    apiLink: apiLink,
    keyCode: keyCode,
    logo: logo,
  };
  //console.log(data)
  return axios
    .post(CREATE_API_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const createCollection = (name, template, file, metadata, userId) => {
  //console.log(template)
  const data = {
    name: name,
    template: template,
    file: file,
    metadata: metadata,
    userId: userId,
  };
  return axios
    .post(CREATE_COLLECTION_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const createItem = (values, collection, file, metadata) => {
  const data = {
    name: values.name,
    collection: collection,
    serie: values.serie,
    price: values.price,
    year: values.year,
    adquiringDate: values.adquiringDate,
    own: values.own,
    notes: values.notes,
    image: file,
    metadata: metadata,
  };
  return axios
    .post(CREATE_ITEM_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        //console.log(response.data)
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const createFeed = (userId, name, url, cleanUrl) => {
  const data = {
    userId: userId,
    name: name,
    url: url,
    cleanUrl: cleanUrl,
  };
  //console.log(data)
  return axios
    .post(CREATE_FEED_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const createSerie = (name, collection, file) => {
  const data = {
    name: name,
    collection: collection,
    file: file,
  };
  //console.log(data)
  return axios
    .post(CREATE_SERIE_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const createTheme = (id, values) => {
  const data = {
    userId: id,
    name: values.name,
    mode: "light",
    topBarColor: values.topbar.css.backgroundColor,
    primaryTextColor: values.primary.css.backgroundColor,
    secondaryTextColor: values.secondary.css.backgroundColor,
    listItemColor: values.listItem.css.backgroundColor,
    sideBarColor: values.sidebar.css.backgroundColor,
    backgroundImage: values.image,
    backgroundColor: values.backColor.css.backgroundColor,
  };
  return axios
    .post(CREATE_THEMES_URL, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const deleteApi = (id) => {
  return axios
    .delete(DELETE_API_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const deleteCollectionItem = (id) => {
  return axios
    .delete(DELETE_COLLECTION_ITEM_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const deleteCollection = (id, cascade) => {
  if (cascade === false) {
    return axios
      .delete(DELETE_COLLECTION_ID_URL(id), { headers: authHeader() })
      .then((response) => {
        return response;
      });
  } else {
    return axios
      .delete(DELETE_COLLECTION_ID_URL_CASCADE(id), { headers: authHeader() })
      .then((response) => {
        return response;
      });
  }
};

const deleteFeed = (id) => {
  return axios
    .delete(DELETE_FEED_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const deleteSerie = (id) => {
  return axios
    .delete(DELETE_SERIE_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const getAllApis = (id) => {
  return axios
    .get(VIEW_APIS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getAllUserFeeds = (id) => {
  return axios
    .get(VIEW_FEEDS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getAllUserReadFeeds = (id) => {
  return axios
    .get(VIEW_FEEDS_READ_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getAllThemes = () => {
  return axios
    .get(VIEW_THEMES_URL, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

//Obtiene todos los Feeds por titulo clickado y usuario
const getUserFeedsIDTitle = (id, title) => {
  return axios
    .get(VIEW_FEEDS_READ_URL_ID(id, title), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getAllSeries = (id) => {
  return axios
    .get(VIEW_SERIES_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getCollectionItemsById = (query) => {
  return axios
    .post(GET_COLLECTION_ITEMS_ID_URL, query, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getCollectionItem = (id) => {
  return axios
    .get(GET_COLLECTION_ITEM_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const getCollectionLists = (id) => {
  return axios
    .get(VIEW_COLLECTIONS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getCollectionItemsPerYear = (id) => {
  return axios
    .get(GET_COLLECTION_ITEMS_YEAR_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      return response;
    });
};

const getCollectionSeries = (id) => {
  return axios
    .get(VIEW_COLLECTION_SERIES_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getCollectionById = (id) => {
  return axios
    .get(GET_COLLECTION_ID_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getImages = (query) => {
  return axios
    .get(GET_IMAGES_QUERY_URL(query), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getItemFromWeb = (searchQuery, apiSelected) => {
  const data = {
    searchQuery: searchQuery,
    url: apiSelected.apiLink,
    header: apiSelected.header,
    keyCode: apiSelected.keyCode,
  };
  //console.log(data);
  return axios
    .post(GET_ITEM_WEB_QUERY_URL, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getLocalImages = () => {
  return axios
    .get(GET_LOCAL_IMAGES_URL, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getMetadataFields = (id) => {
  return axios
    .get(GET_COLLECTION_METADATAS_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getMostValuableItem = (id) => {
  return axios
    .get(MOST_VALUABLE_ITEM_URL(id), { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getRecentCollectionItemsById = (query) => {
  return axios
    .post(GET_RECENT_COLLECTION_ITEMS_ID_URL, query, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getUserConfig = (id) => {
  var userData = JSON.parse(localStorage.getItem("user"));
  return axios
    .get(CONFIG_URL(id), { headers: authHeader() })
    .then((response) => {
      buildUserConfig(response, userData.userName);
      return response;
    });
};

const importItemFromWeb = (item) => {
  return axios
    .post(IMPORT_ITEM_WEB_URL, item, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const buildUserConfig = (response, userName) => {
  const userConfig = {
    userName: userName,
    darkTheme: response.data.darkTheme,
  };
  localStorage.setItem("userConfig", JSON.stringify(userConfig));
};

const parseFile = (fileJSON) => {
  return axios
    .post(FILE_PARSE_URL, fileJSON, { headers: authHeader() })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const putFile = (file) => {
  var formData = new FormData();
  formData.append("name", file);
  formData.append("file", file);
  return axios
    .put(FILE_URL, formData, {
      headers: authHeader(),
      "Content-Type": "multipart/form-data",
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response) {
        return error.response;
      }
    });
};

const putImage = (name, image) => {
  var formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);
  return axios
    .put(IMAGES_URL, formData, {
      headers: authHeader(),
      "Content-Type": "multipart/form-data",
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response) {
        return error.response;
      }
    });
};

const saveConfigAppearance = (id, theme, dark, config) => {
  const data = {
    id: id,
    theme: theme,
    dark: dark,
    config: config,
  };
  return axios
    .post(POST_APPEARANCE_CONFIG, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const saveConfigDashboard = (id, expensivePanel, wishlistPanel, recentPurchasePanel, completedCollectionsPanel, config) => {
  const data = {
    id: id,
    expensivePanel: expensivePanel,
    wishlistPanel: wishlistPanel,
    recentPurchasePanel: recentPurchasePanel,
    completedCollectionsPanel: completedCollectionsPanel,
    config: config,
  };
  return axios
    .post(POST_APPEARANCE_CONFIG, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const toggleCollectionAmbit = (id, ambit) => {
  const data = {
    id: id,
    ambit: ambit,
  };
  return axios
    .post(TOGGLE_COLLECTION_AMBIT_URL, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response);
      return response;
    });
};

const toggleItemOwn = (id, own, wanted) => {
  const data = {
    id: id,
    own: own,
    wanted: wanted,
  };
  return axios
    .post(TOGGLE_COLLECTION_ITEM_OWN_URL, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response);
      return response;
    });
};

const toggleItemWish = (id, own, wanted) => {
  const data = {
    id: id,
    own: own,
    wanted: wanted,
  };
  return axios
    .post(TOGGLE_COLLECTION_ITEM_WISH_URL, data, { headers: authHeader() })
    .then((response) => {
      //console.log(response);
      return response;
    });
};

const updateApi = (values) => {
  const data = {
    id: values.id,
    name: values.name,
    header: values.header,
    apiLink: values.apiLink,
    keyCode: values.keyCode,
    logo: values.logo,
  };
  return axios
    .put(UPDATE_API_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        //console.log(response.data)
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const updateFeed = (values) => {
  const data = {
    id: values.id,
    name: values.name,
    url: values.rssUrl,
    logo: values.logo
  };
  return axios
    .put(UPDATE_FEED_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        //console.log(response.data)
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const updateItem = (values, collection, file, metadata) => {
  const data = {
    id: values.id,
    name: values.name,
    collection: collection,
    serie: values.serie,
    price: values.price,
    year: values.year,
    adquiringDate: values.adquiringDate,
    own: values.own,
    notes: values.notes,
    image: file,
    metadata: metadata,
  };
  return axios
    .put(UPDATE_ITEM_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        //console.log(response.data)
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const updateSerie = (values, image) => {
  const data = {
    id: values.id,
    name: values.name,
    collection: values.collection,
    path: image,
  };
  return axios
    .put(UPDATE_SERIE_URL, data, { headers: authHeader() })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        //console.log(response.data)
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const viewFeed = (url) => { };

const ConfigService = {
  countCollections,
  countCollectionsItems,
  countCollectionsMoney,
  countCollectionsWishlist,
  countCompletedCollections,
  createCollection,
  createApi,
  createFeed,
  createItem,
  createSerie,
  createTheme,
  deleteApi,
  deleteCollectionItem,
  deleteCollection,
  deleteFeed,
  deleteSerie,
  getAllApis,
  getAllSeries,
  getAllThemes,
  getAllUserFeeds,
  getAllUserReadFeeds,
  getCollectionItemsById,
  getCollectionById,
  getCollectionItem,
  getCollectionItemsPerYear,
  getCollectionLists,
  getCollectionSeries,
  getImages,
  getItemFromWeb,
  getLocalImages,
  getMetadataFields,
  getMostValuableItem,
  getRecentCollectionItemsById,
  getUserConfig,
  getUserFeedsIDTitle,
  importItemFromWeb,
  parseFile,
  putFile,
  putImage,
  saveConfigAppearance,
  saveConfigDashboard,
  toggleCollectionAmbit,
  toggleItemOwn,
  toggleItemWish,
  updateApi,
  updateFeed,
  updateItem,
  updateSerie,
  viewFeed,
};

export default ConfigService;