import axios from "axios";
const BASE_URL_API = "http://ec2-13-38-127-249.eu-west-3.compute.amazonaws.com/api/v1/" 

const axiosConfig = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosConfig.interceptors.response.use(
  function (response) {
    return response;
  }
);

export default axiosConfig;
