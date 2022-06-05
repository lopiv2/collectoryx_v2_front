import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const CREATE_COLLECTION_URL = `${API_URL}/create-collection`;
const IMAGES_URL = `${API_URL}/images`;

const putImage = (name, image) => {
  var formData = new FormData();
  console.log(image);
  formData.append("name", name);
  formData.append("image", image);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  return axios
    .put(IMAGES_URL, formData, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.headers);
        return error.response;
      }
    });
};

const createCollection = (name, template, file) => {
  var formData = new FormData();
  //console.log(image);
  /*formData.append("name", name);
  formData.append("template", template);
  formData.append("file", file);*/
  const data={
      name:name,
      template:template,
      file:file
  }
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  return axios
    .post(CREATE_COLLECTION_URL, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        console.log(name, template, file);
        //putImage()
        return response;
      }
      return Promise.reject(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        return error.response;
      }
    });
};

const ConfigService = {
  createCollection,
  putImage,
};

export default ConfigService;
