import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;
const SHOP_URL = `${API_URL}/shop`;
const GET_KEYFILE_EMAIL_URL = (email) => `${SHOP_URL}/key-request/${email}`;

const getKeyFileByEmail = (email) => {
    return axios.get(GET_KEYFILE_EMAIL_URL(email), { headers: authHeader() }).then((response) => {
        console.log(response.data);
        return response;
    });
};

const ShopService = {
    getKeyFileByEmail
};

export default ShopService;