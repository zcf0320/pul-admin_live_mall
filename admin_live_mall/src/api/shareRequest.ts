import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';
import { history } from '@umijs/max';

const instance = axios.create();

const loginPath = '/shareLogin';

// @ts-ignore
instance.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      token: localStorage.getItem('shareToken'),
    },
    params: config.params?.pageSize
      ? { ...config.params, pageNo: config?.params?.current ?? config?.params?.pageNo }
      : config.params,
  };
});

instance.interceptors.response.use((response) => {
  const { data } = response as unknown as API.Response;
  if (data.code && data.code !== 0) {
    if (data.code === 401) {
      history.push(loginPath);
      localStorage.clear();
      message.error('登录已过期');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return Promise.reject(data.message);
    }
    message.error(data.message);
    return Promise.reject(data.message);
  }
  console.log(response);
  return response.data;
});

const request = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get<T>(url, config) as Promise<T>;
  },
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post<T>(url, data, config) as Promise<T>;
  },
};

export default request;
