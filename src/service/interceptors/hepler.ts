/*
 * @Description: 处理 http 错误状态
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-04-02 22:19:48
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 15:33:43
 */

import { CatchError, CustomAxiosResponse } from '@/service/baseAxiosRequest/baseAxios'

import { useStorageHelper } from '@/hooks'
import config from '@/config'
import { useStore } from '@/store'

interface ErrorParams {
  msg: string
}

type ErrorMapKey = number | string | undefined

interface ErrorMap {
  handler: (params: ErrorParams) => boolean | void
  msg: string
}

/**
 * 处理携带请求头求头
 * @returns
 */
export function requestHeaders() {
  const headers = { ...config.axios.headers }

  const token = useStorageHelper().getTokenCahce()

  if (token) {
    headers.Authorization += token
  }

  return {}
}

/**
 * 处理 http 请求错误
 * @param error
 * @returns
 */
export function handleHttpError(error: CatchError): boolean {
  /**
   * error message
   * @param msg
   */
  function errorMessage(msg: string) {
    import('element-plus').then(el => el.ElMessage.error(msg))
  }

  /**
   * 默认值的 错误处理
   * @param config
   * @returns
   */
  function defaultError(config: ErrorParams) {
    errorMessage(config.msg)

    return true
  }

  /**
   * 无权限 403 处理
   * @param config
   */
  function noAuthError(config: ErrorParams) {
    errorMessage(config.msg)

    const { userStore } = useStore()
    userStore.loginOutSystem()
  }

  const errorMap = new Map<ErrorMapKey, ErrorMap>([
    [undefined, { handler: defaultError, msg: 'Network Error' }],
    [401, { handler: noAuthError, msg: 'Unauthorized' }],
    [400, { handler: defaultError, msg: 'Bad Request' }],
    [403, { handler: defaultError, msg: 'Forbidden' }],
    [404, { handler: defaultError, msg: 'Not Found' }],
    [500, { handler: defaultError, msg: 'Internal Server Error' }]
  ])

  const _errorHandler = errorMap.get(error.response?.status)

  if (!_errorHandler) return false

  _errorHandler.handler({
    msg: error.response?.data?.msg || _errorHandler.msg
  })

  return true
}

export function handleHttpBodyStatus(response: CustomAxiosResponse) {
  // if (response.data.code !== 1) {
  //   ElMessage.error(response.data.msg)
  // }
}
