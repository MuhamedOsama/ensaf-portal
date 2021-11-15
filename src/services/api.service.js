import { TokenService } from './storage.service';
import axios from 'axios';
import store from '../store/index';

const ApiService = {
  _401interceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    this.setHeader();
    this.mount401Interceptor();
  },

  setHeader() {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${TokenService.getToken()}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource, { validateStatus: false });
  },

  post(resource, data) {
    return axios.post(resource, data, { validateStatus: false });
  },
  postFile(resource, data) {
    return axios.post(resource, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  put(resource, data) {
    return axios.put(resource, data, { validateStatus: false });
  },

  delete(resource) {
    return axios.delete(resource, { validateStatus: false });
  },
  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      (response) => {
        if (response.status == 401) {
          store.dispatch('auth/logout');
        }
        return response;
      },
      async (error) => {
        if (error.request.status == 401) {
          await store.dispatch('auth/logout');
          // throw error
        }
      }
    );
  },

  unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  },
};

export default ApiService;
