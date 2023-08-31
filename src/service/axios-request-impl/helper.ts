import { ElMessage } from 'element-plus'

const DEFAULT_ERROR_MESSAGE = '服务器错误'

export enum ResultEnum {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  Unauthorized = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

export function showErrorMessage(message: string) {
  ElMessage({
    message: message || DEFAULT_ERROR_MESSAGE,
    grouping: true,
    type: 'error'
  })
}
