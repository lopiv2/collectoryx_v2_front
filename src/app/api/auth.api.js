import axios from "axios";
import jwt_decode from "jwt-decode";
import { toast } from 'react-toastify';
import { FormattedMessage } from "react-intl";
import { useEffect, useState, useContext } from "react";

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = "http://localhost:8083";
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
      //console.log(response.data);
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

const checkUserLogged = () => {
  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user")
    var userData = JSON.parse(user);
    if (userData.role === "ADMIN_ROLE") {
      return "ADMIN_ROLE"
    }
    else {
      return "USER_ROLE"
    }
  }
}

const checkTokenExpired = (props) => {
  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user")
    var userData = JSON.parse(user);
    //console.log(userData)
    const jwt_Token_decoded = jwt_decode(userData.token);
    if (jwt_Token_decoded.exp * 1000 < Date.now()) {
      //console.log("caducado")
      toast.error(<FormattedMessage id="app.signin.token_expired"></FormattedMessage>, { theme: "colored" })
      localStorage.clear();
      return false;
    }
    else {
      return true;
    }
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
      id: response.data.id,
      status: status,
      license: response.data.license,
      token: response.data.token,
      role: response.data.role,
      email: response.data.email
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
  checkUserLogged,
  checkTokenExpired,
  register,
  login,
  logout,
  getCurrentUser,
  buildUser,
  isLogged
};
export default AuthService;




