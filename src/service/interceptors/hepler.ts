/*
 * @Description: 处理 http 错误状态
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-04-02 22:19:48
 * @LastEditors: qsyj
 * @LastEditTime: 2022-04-02 23:04:55
 */

import { CatchError } from '@/types/service/baseAxios'

import { useStorageHelper } from '@/hooks'
import config from '@/config'

type ErrorMapKey = number | string | undefined
interface ErrorMap {
  handler: () => void
}

/**
 * 处理 http 请求错误
 * @param error
 * @returns
 */
export function handleHttpError(error: CatchError): boolean {
  /**
   * Network Error
   */
  function netWorkError() {
    import('element-plus').then(el => el.ElMessage.error('Network Error'))
  }

  const errorMap = new Map<ErrorMapKey, ErrorMap>([[undefined, { handler: netWorkError }]])

  const _errorHandler = errorMap.get(error.code)

  if (!_errorHandler) return false

  _errorHandler.handler()

  return true
}

/**
 * 处理携带请求头求头
 * @returns
 */
export function requestHeaders() {
  const headers = { ...config.axios.headers }

  const token = useStorageHelper().getTokenCahce()

  if (token) {
    headers.Authrization += token
  }

  return headers
}
