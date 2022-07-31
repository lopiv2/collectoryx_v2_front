import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN_URL = `${API_URL}/admin`;
const GET_KEYFILE_EMAIL_URL = (email) => `${ADMIN_URL}/keygen/${email}`;
const VIEW_LICENSES_URL = `${ADMIN_URL}/get-pending-licenses`;

const getKeyFileByEmail = (email) => {
    return axios.get(GET_KEYFILE_EMAIL_URL(email), { headers: authHeader() }).then((response) => {
        console.log(response.data);
        return response;
    });
};

const getAllPendingLicenses = () => {
    return axios.get(VIEW_LICENSES_URL, { headers: authHeader() }).then((response) => {
        console.log(response.data);
        return response;
    });
};

const AdminService = {
    getKeyFileByEmail,
    getAllPendingLicenses
};

export default AdminService;