import axios, { AxiosError } from 'axios'

// 是否是 cancel 请求错误
export function isCancelError(error: Error) {
  return axios.isCancel(error)
}

// 是否是 AxiosError 请求错误
export function isAxiosError(error: Error): error is AxiosError {
  return axios.isAxiosError(error)
}
