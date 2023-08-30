import { ElMessage } from 'element-plus'

const DEFAULT_ERROR_MESSAGE = '服务器错误'

export function showErrorMessage(message: string) {
  ElMessage({
    message: message || DEFAULT_ERROR_MESSAGE,
    grouping: true,
    type: 'error'
  })
}
