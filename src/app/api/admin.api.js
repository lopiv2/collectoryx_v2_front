import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN_URL = `${API_URL}/admin`;
const GET_KEYFILE_EMAIL_URL = `${ADMIN_URL}/keygen`;
const VIEW_PENDING_LICENSES_URL = `${ADMIN_URL}/get-pending-licenses`;
const VIEW_ALL_LICENSES_URL = `${ADMIN_URL}/get-all-licenses`;

const setKeyFileByEmail = (email) => {
    const data = {
        email: email,
      };
    return axios.post(GET_KEYFILE_EMAIL_URL, data, { headers: authHeader() }).then((response) => {
        return response;
    });
};

const getAllPendingLicenses = () => {
    return axios.get(VIEW_PENDING_LICENSES_URL, { headers: authHeader() }).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const getAllLicenses = () => {
    return axios.get(VIEW_ALL_LICENSES_URL, { headers: authHeader() }).then((response) => {
        //console.log(response.data);
        return response;
    });
};

const AdminService = {
    setKeyFileByEmail,
    getAllLicenses,
    getAllPendingLicenses
};

export default AdminService;