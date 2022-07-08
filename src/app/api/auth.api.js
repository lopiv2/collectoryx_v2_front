import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const LOGIN_URL = `${API_URL}/login`;
const REGISTER_URL = `${API_URL}/register`;

const login = (user_name, password) => {
  return axios
    .post(LOGIN_URL, {
      user_name,
      password,
    })
    .then((response) => {
      buildUser(response, user_name);
      //console.log(user_name);
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return Promise.reject(response);
    }).catch((error) => {
      if (error.response) {
        //console.log(error.response.status);
        return error.response;
      }
    });
};

const isLogged = () => {
  if (getCurrentUser()) {
    return true;
  }
  else {
    return false;
  }
};

const buildUser = (response, user_name) => {
  var status = "";
  if (response.data.token) {
    if (response.status === 200) {
      status = "logged";
    }
    else {
      status = "not_logged"
    }
    const user = {
      user_name: user_name,
      status: status,
      token: response.data.token
    }
    //console.log(user.token);
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const register = (firstName, lastName, email, userName, password) => {
  return axios.post(REGISTER_URL, {
    firstName,
    lastName,
    email,
    userName,
    password,
  });
};

const logout = () => {
  localStorage.removeItem("user");
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  buildUser,
  isLogged
};
export default AuthService;




