import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;
const CREATE_SERIE_URL = `${API_URL}/create-serie`;
const VIEW_COLLECTIONS_URL = `${API_URL}/view-collections`;
const VIEW_SERIES_URL = `${API_URL}/view-series`;
const GET_COLLECTION_ID_URL = (id) => `${API_URL}/collections/${id}`;
const COUNT_COLLECTIONS_URL = `${API_URL}/count-collections`;
const COUNT_COLLECTIONS_ITEMS_URL = `${API_URL}/count-collections-items`;
const COUNT_COLLECTIONS_MONEY_URL = `${API_URL}/count-collections-money`;
const TOGGLE_COLLECTION_ITEM_OWN_URL = `${API_URL}/toggle-item-own`;
const IMAGES_URL = `${API_URL}/images`;

const putImage = (name, image) => {
    var formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    return axios.put(IMAGES_URL, formData, {
        headers: headers,
    })
        .then((response) => {
            return response;
        }).catch((error) => {
            if (error.response) {
                return error.response;
            }
        });
};

const countCollectionsMoney = () => {
    return axios.get(COUNT_COLLECTIONS_MONEY_URL).then((response) => {
        //console.log(response.data);
        return response;
    })
};

const countCollections = () => {
    return axios.get(COUNT_COLLECTIONS_URL).then((response) => {
        //console.log(response.data);
        return response.data;
    })
}

const countCollectionsItems = () => {
    return axios.get(COUNT_COLLECTIONS_ITEMS_URL).then((response) => {
        //console.log(response.data);
        return response.data;
    })
}

const createCollection = (name, template, file) => {
    const data = {
        name: name,
        template: template,
        file: file
    }
    return axios
        .post(CREATE_COLLECTION_URL, data)
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                return response;
            }
            return Promise.reject(response);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.status);
                return error.response;
            }
        });
};

const createSerie = (name, file) => {
    const data = {
        name: name,
        file: file
    }
    return axios
        .post(CREATE_SERIE_URL, data)
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                return response;
            }
            return Promise.reject(response);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.status);
                return error.response;
            }
        });
};

const toggleItemOwn = (id, own) => {
    const data = {
        id: id,
        own: own
    }
    return axios.post(TOGGLE_COLLECTION_ITEM_OWN_URL, data)
        .then((response) => {
            //console.log(response);
            return response;
        })
}

const getCollectionLists = () => {
    return axios.get(VIEW_COLLECTIONS_URL).then((response) => {
        //console.log(response.data);
        return response;
    })
};

const getCollectionSeries = () => {
    return axios.get(VIEW_SERIES_URL).then((response) => {
        //console.log(response.data);
        return response;
    })
};

const getCollectionById = (id) => {
    return axios.get(GET_COLLECTION_ID_URL(id)).then((response) => {
        //console.log(response.data);
        return response;
    })
};

const ConfigService = {
    createCollection,
    createSerie,
    putImage,
    getCollectionLists,
    getCollectionById,
    countCollections,
    countCollectionsItems,
    getCollectionSeries,
    toggleItemOwn,
    countCollectionsMoney
};

export default ConfigService;
