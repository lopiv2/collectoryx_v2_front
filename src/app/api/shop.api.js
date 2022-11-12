import axios from "axios";
import authHeader from "./auth-header";

const API_URL = window.env.API_URL;
const SHOP_URL = `${API_URL}/shop`;
const GET_KEYFILE_EMAIL_URL = `${SHOP_URL}/key-request`;

const getKeyFileByEmail = (email, licenseSelected) => {
  return axios
    .post(
      GET_KEYFILE_EMAIL_URL,
      {
        email,
        licenseSelected,
      },
      { headers: authHeader() }
    )
    .then((response) => {
      //console.log(response.data);
      return response;
    });
};

const ShopService = {
  getKeyFileByEmail,
};

export default ShopService;
