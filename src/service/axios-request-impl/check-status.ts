import { useUserStore } from '@/store'
import { ResultEnum, showErrorMessage } from './helper'

export function checkStatus(status: number): void {
  let errMessage = ''

  switch (status) {
    case ResultEnum.BAD_REQUEST:
      {
        errMessage = '请求语法错误，服务器无法理解'
      }
      break
    case ResultEnum.UNAUTHORIZED:
      {
        errMessage = '请求需要用户身份认证'
        const userStore = useUserStore()
        userStore.loginOutSystem()
      }
      break
    case ResultEnum.FORBIDDEN:
      {
        errMessage = '资源禁止访问'
      }
      break
    case ResultEnum.NOT_FOUND:
      {
        errMessage = '请求的资源不存在'
      }
      break
    case ResultEnum.INTERNAL_SERVER_ERROR:
      {
        errMessage = '服务器内部错误'
      }
      break
    case ResultEnum.BAD_GATEWAY:
      {
        errMessage = '网关错误'
      }
      break
    case ResultEnum.SERVICE_UNAVAILABLE:
      {
        errMessage = '服务器当前无法处理请求'
      }
      break
    default:
      errMessage = '服务器内部错误'
  }

  showErrorMessage(errMessage)
}
