import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const USERS_URL = `${API_URL}/users`;
<<<<<<< HEAD
const LOGIN_URL = `${API_URL}/auth/login`;
const REGISTER_URL = `${API_URL}/auth/register`;
const url = `http://localhost:8080/auth/login`;
=======
const LOGIN_URL = `${API_URL}/login`;
const REGISTER_URL = `${API_URL}/register`;
>>>>>>> 4a1d133b (first commit)

const login = (user_name, password) => {
  return axios
    .post(LOGIN_URL, {
      user_name,
      password,
    })
    .then((response) => {
      buildUser(response, user_name);
<<<<<<< HEAD
      //console.log(response);
      return response;
    });
};

=======
      //return response;
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

/*axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  console.log(error.message);
  return Promise.reject(error);
});*/

>>>>>>> 4a1d133b (first commit)
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
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const register = (user_name, email, password) => {
  return axios.post(REGISTER_URL, {
    user_name,
    email,
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
<<<<<<< HEAD
  isLogged
=======
  isLogged,
>>>>>>> 4a1d133b (first commit)
};
export default AuthService;




