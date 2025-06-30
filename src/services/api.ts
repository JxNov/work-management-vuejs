import Cookie from 'js-cookie';
import axios, { HttpStatusCode, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ACCESS_TOKEN } from '@/constants/variables';
import { VITE_APP_API_URL } from '@/definitions';
import { ROUTES } from '@/constants/routers';
import type { TParams } from '@/types/common.types';

const apiConfig = axios.create({
  baseURL: `${VITE_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiConfig.interceptors.request.use(
  config => {
    const token = Cookie.get(ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiConfig.interceptors.response.use(
  // @ts-ignore
  (res: AxiosResponse) => {
    if (res.data.code === HttpStatusCode.Unauthorized) {
      Cookie.remove(ACCESS_TOKEN);
      window.location.href = ROUTES.AUTH_LOGIN;
      return Promise.reject(res);
    }

    return res;
  },
  error => {
    if (error.response && error.response?.status === HttpStatusCode.Unauthorized) {
      if (typeof window !== 'undefined') {
        Cookie.remove(ACCESS_TOKEN);
        window.location.href = ROUTES.AUTH_LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

const apiServices = {
  post(url: string, params?: TParams, config?: AxiosRequestConfig) {
    return apiConfig.post(url, params, config);
  },

  put(url: string, params?: TParams) {
    return apiConfig.put(url, params);
  },

  patch(url: string, params?: TParams) {
    return apiConfig.patch(url, params);
  },

  get(url: string, params?: TParams) {
    return apiConfig.get(url, { params });
  },

  getBlob(url: string, params?: TParams) {
    return apiConfig.get(url, { params, responseType: 'blob' });
  },

  delete(url: string, params?: TParams) {
    return apiConfig.delete(url, { data: params });
  },
};

export { apiServices };
