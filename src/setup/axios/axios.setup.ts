import axios from 'axios';
import tmdbApiConstants from '../../constants/tmdbApi.constants';

export const tmdbAxios = axios.create({
  baseURL: tmdbApiConstants.baseUrl,
});

tmdbAxios.interceptors.request.use(
  (config) => {
    // console.log(`Axios ${config.method} request intercepted for url ${config.url}`);
    if (!config.params) {
      config.params = {};
    }

    config.params.api_key = tmdbApiConstants.apiKey;

    if (config.url?.includes('account')) {
      const userState = JSON.parse(localStorage.getItem('userStoreData') || '{}');
      config.params.session_id = userState.state.sessionId;
    }
    return config;
  },
  (error) => {
    console.error('An error occurred while doing the axios request', error);
    return Promise.reject(error);
  }
);
