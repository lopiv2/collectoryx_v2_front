import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;
const CREATE_SERIE_URL = `${API_URL}/create-serie`;
const VIEW_COLLECTIONS_URL = `${API_URL}/view-collections`;
const VIEW_SERIES_URL = `${API_URL}/view-series`;
const VIEW_COLLECTION_SERIES_URL = (id) => `${API_URL}/view-collection-series/${id}`;
const GET_COLLECTION_ID_URL = (id) => `${API_URL}/collections/${id}`;
const DELETE_COLLECTION_ITEM_ID_URL = (id) =>
    `${API_URL}/delete-collection-item/${id}`;
const DELETE_COLLECTION_ID_URL = (id) =>
    `${API_URL}/delete-collection/${id}`;
const COUNT_COLLECTIONS_URL = `${API_URL}/count-collections`;
const COUNT_COLLECTIONS_ITEMS_URL = `${API_URL}/count-collections-items`;
const COUNT_COLLECTIONS_MONEY_URL = `${API_URL}/count-collections-money`;
const TOGGLE_COLLECTION_ITEM_OWN_URL = `${API_URL}/toggle-item-own`;
const TOGGLE_COLLECTION_ITEM_WISH_URL = `${API_URL}/toggle-item-wish`;
const IMAGES_URL = `${API_URL}/images`;

const putImage = (name, image) => {
    var formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    const headers = {
        "Content-Type": "multipart/form-data",
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

const countCollectionsMoney = () => {
    return axios.get(COUNT_COLLECTIONS_MONEY_URL).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const countCollections = () => {
    return axios.get(COUNT_COLLECTIONS_URL).then((response) => {
        //console.log(response.data);
        return response.data;
    });
};

const countCollectionsItems = () => {
    return axios.get(COUNT_COLLECTIONS_ITEMS_URL).then((response) => {
        //console.log(response.data);
        return response.data;
    });
};

const createCollection = (name, template, file, metadata) => {
    const data = {
        name: name,
        template: template,
        file: file,
        metadata: metadata
    };
    return axios
        .post(CREATE_COLLECTION_URL, data)
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
    console.log(data)
    return axios
        .post(CREATE_SERIE_URL, data)
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
    return axios.delete(DELETE_COLLECTION_ITEM_ID_URL(id)).then((response) => {
        return response;
    });
};

const toggleItemOwn = (id, own, wanted) => {
    const data = {
        id: id,
        own: own,
        wanted: wanted
    };
    return axios.post(TOGGLE_COLLECTION_ITEM_OWN_URL, data).then((response) => {
        //console.log(response);
        return response;
    });
};

const toggleItemWish = (id, own, wanted) => {
    const data = {
        id: id,
        own: own,
        wanted: wanted
    };
    return axios.post(TOGGLE_COLLECTION_ITEM_WISH_URL, data).then((response) => {
        //console.log(response);
        return response;
    });
};

const getCollectionLists = () => {
    return axios.get(VIEW_COLLECTIONS_URL).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const getAllSeries = () => {
    return axios.get(VIEW_SERIES_URL).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const getCollectionSeries = (id) => {
    return axios.get(VIEW_COLLECTION_SERIES_URL(id)).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const getCollectionById = (id) => {
    return axios.get(GET_COLLECTION_ID_URL(id)).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const ConfigService = {
    createCollection,
    createSerie,
    deleteCollectionItem,
    putImage,
    getCollectionLists,
    getCollectionById,
    countCollections,
    countCollectionsItems,
    getAllSeries,
    getCollectionSeries,
    toggleItemOwn,
    toggleItemWish,
    countCollectionsMoney,
};

export default ConfigService;
