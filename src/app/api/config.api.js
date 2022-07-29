import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;
const GET_COLLECTION_ITEMS_ID_URL = (id) => `${API_URL}/collections/${id}`;
const COUNT_COLLECTIONS_URL = (id) => `${API_URL}/count-collections/${id}`;
const COUNT_COLLECTIONS_ITEMS_URL = (id) =>
  `${API_URL}/count-collections-items/${id}`;
const COUNT_COLLECTIONS_MONEY_URL = (id) =>
  `${API_URL}/count-collections-money/${id}`;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;
const CREATE_ITEM_URL = `${API_URL}/create-item`;
const CREATE_SERIE_URL = `${API_URL}/create-serie`;
const DELETE_COLLECTION_ITEM_ID_URL = (id) =>
  `${API_URL}/delete-collection-item/${id}`;
const DELETE_COLLECTION_ID_URL = (id) => `${API_URL}/delete-collection/${id}`;
const DELETE_COLLECTION_ID_URL_CASCADE = (id) =>
  `${API_URL}/delete-collection-cascade/${id}`;
const GET_COLLECTION_ITEM_ID_URL = (id) => `${API_URL}/get-item/${id}`;
const GET_COLLECTION_ID_URL = (id) => `${API_URL}/get-collection/${id}`;
const GET_IMAGES_QUERY_URL = (query) =>
  `${API_URL}/marvel/item-images/${query}`;
const IMAGES_URL = `${API_URL}/images`;
const TOGGLE_COLLECTION_ITEM_OWN_URL = `${API_URL}/toggle-item-own`;
const TOGGLE_COLLECTION_ITEM_WISH_URL = `${API_URL}/toggle-item-wish`;
const UPDATE_ITEM_URL = `${API_URL}/update-item`;
const VIEW_COLLECTIONS_URL = (id) => `${API_URL}/view-collections/${id}`;
const VIEW_SERIES_URL = `${API_URL}/view-series`;
const VIEW_COLLECTION_SERIES_URL = (id) =>
  `${API_URL}/view-collection-series/${id}`;

const countCollectionsMoney = (id) => {
  return axios
    .get(COUNT_COLLECTIONS_MONEY_URL(id), { headers: authHeader() })
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

const createCollection = (name, template, file, metadata) => {
  //console.log(template)
  const data = {
    name: name,
    template: template,
    file: file,
    metadata: metadata,
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

const getAllSeries = () => {
  return axios
    .get(VIEW_SERIES_URL, { headers: authHeader() })
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const getCollectionItemsById = (id) => {
  return axios
    .get(GET_COLLECTION_ITEMS_ID_URL(id), { headers: authHeader() })
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
      console.log(response.data);
      return response;
    });
};

const putImage = (name, image) => {
  var formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);
  const headerAuth = authHeader();
  const headers = {
    "Content-Type": "multipart/form-data",
    headerAuth,
  };
  return axios
    .put(IMAGES_URL, formData, {
      headers: headers,
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

const ConfigService = {
  countCollections,
  countCollectionsItems,
  countCollectionsMoney,
  createCollection,
  createItem,
  createSerie,
  deleteCollectionItem,
  deleteCollection,
  getAllSeries,
  getCollectionItemsById,
  getCollectionById,
  getCollectionItem,
  getCollectionLists,
  getCollectionSeries,
  getImages,
  putImage,
  toggleItemOwn,
  toggleItemWish,
  updateItem,
};

export default ConfigService;
