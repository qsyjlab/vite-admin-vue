/*
 * @Description: axios 拦截器
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-04-02 22:03:14
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 10:24:05
 */

import type {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType
} from '@/service/baseAxiosRequest/baseAxios'

import { handleHttpError, requestHeaders } from './hepler'

const requestInterceptors: RequestInterceptorsType = config => {
  config.headers = requestHeaders()

  // console.log(config.headers)

  return config
}

const requestInterceptorsCatch: RequestInterceptorsCatchType = error => {
  return error
}

const responseInterceptors: ResponseInterceptorsType = response => {
  return response
}

const responseInterceptorsCatch: ResponseInterceptorsCatchType = error => {
  handleHttpError(error)

  return error
}

export const interceptorsHooks: InterceptorsType = {
  requestInterceptors,
  requestInterceptorsCatch,
  responseInterceptors,
  responseInterceptorsCatch
}
