import axios from 'axios'

// 是否是 cancel 请求错误
export function isCancelError(error: Error) {
  return axios.isCancel(error)
}
