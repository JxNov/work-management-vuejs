import type { AxiosRequestConfig } from 'axios';

export type TParams = { [x: string]: unknown } | undefined;

export type ValueOptions = {
  config?: AxiosRequestConfig;
  params?: TParams;
  data?: { [x: string]: unknown };
  id?: { [x: string]: unknown };
};
