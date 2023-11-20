import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

function createMessageBox() {
  // TODO: 拓展功能
}

export function useMessage() {
  return {
    createMessageBox,
    message: ElMessage,
    notification: ElNotification,
    messageBox: ElMessageBox
  }
}
