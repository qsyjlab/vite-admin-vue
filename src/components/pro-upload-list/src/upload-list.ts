export enum UploadStatusEnum {
  READY = 'ready',
  FAIL = 'fail',
  SUCCESS = 'success',
  UPLOADING = 'uploading'
}

export const uploadStatusMap = {
  [UploadStatusEnum.SUCCESS]: {
    type: 'success',
    text: '上传成功'
  },
  [UploadStatusEnum.READY]: {
    type: 'primary',
    text: '待上传'
  },
  [UploadStatusEnum.UPLOADING]: {
    type: 'info',
    text: '上传中'
  },
  [UploadStatusEnum.FAIL]: {
    type: 'danger',
    text: '上传失败'
  }
}
