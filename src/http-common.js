import axios from "axios";
export default axios.create({
  baseURL: window.env.API_URL || "http://localhost:8080",
  headers: {
    "Content-type": "application/json",
  },
});
