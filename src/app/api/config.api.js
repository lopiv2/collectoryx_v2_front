import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;
const VIEW_COLLECTIONS_URL = `${API_URL}/view-collections`;
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

const getCollectionLists = () => {
    return axios.get(VIEW_COLLECTIONS_URL).then((response) => {
        //console.log(response.data);
        return response;
    })
};

const ConfigService = {
    createCollection, putImage, getCollectionLists
};

export default ConfigService;
