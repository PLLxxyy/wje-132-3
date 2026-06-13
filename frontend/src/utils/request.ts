import axios, { AxiosError } from 'axios';
import { message } from 'antd';
import type { ApiResponse } from '../types';

export const request = axios.create({
  timeout: 12000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('safety_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data && data.code === 1 && data.message) {
      message.warning(data.message);
    }
    return response;
  },
  (error: AxiosError<ApiResponse<null>>) => {
    const text = error.response?.data?.message ?? error.message ?? '请求失败';
    message.error(text);
    return Promise.reject(error);
  },
);

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}
