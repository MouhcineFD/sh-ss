/* eslint-disable dot-notation */
import { BASE_URL } from "../utils/constants";

const axios = require("axios").default;

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const parseUrl = ({ url, vars }) =>
  url.replace(new RegExp("{([^{]+)}", "g"), (_unused, varName) => {
    if (vars && vars[varName]) return vars[varName];
    throw Error(`${varName} of ${url} not defined in vars api config`);
  });

const isUnauthorized = (error) => false;

const handleUnauthorized = (error) => {
  source.cancel("Canceled by handleUnauthorized");
  api.onUnauthorized && api.onUnauthorized(error);
};

export const api = axios.create({
  baseURL: BASE_URL,
});

api.defaults.baseURL = BASE_URL;
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.post["Content-Type"] = "application/json";

api.interceptors.request.use((config) => {
  if (config.url) {
    config.url = parseUrl(config);
  }
  return { cancelToken: source.token, ...config };
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (isUnauthorized(error)) handleUnauthorized(error);
      if (error.response.data) return Promise.reject(error.response.data);
      return Promise.reject(error.response);
    }
    if (error.request) return Promise.reject(error.request);
    if (error.config) return Promise.reject(error.config);
    return Promise.reject(error);
  }
);

api.setAccessToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = "Bearer " + token;
};

api.resetAccessToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default axios;
