import axios from "axios";
import { apiBase } from "../configuration/index.js";
import AppError from "../common/Exception/app-error.js";

const httpClient = axios.create({
  baseURL: apiBase,
  timeout: 20000,
});

export function setAuthToken(token) {
  if (token) {
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete httpClient.defaults.headers.common["Authorization"];
  }
}

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error(error)
    throw new AppError(error.response?.data?.message || "HTTP_REQUEST_FAILED", error.response?.status || 500);
  }
);


export default httpClient;

