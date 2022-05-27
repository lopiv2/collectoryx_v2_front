import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;

const createCollection = (name, template, logos) => {
    console.log(name + " " + template + " " + logos);
    const logo = {
        name: logos,
        path: logos
    }
    return axios
        .post(CREATE_COLLECTION_URL, {
            name,
            template,
            logo
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200 || response.status === 201) {
                console.log(name, template, logo);
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

const ConfigService = {
    createCollection
};

export default ConfigService;
