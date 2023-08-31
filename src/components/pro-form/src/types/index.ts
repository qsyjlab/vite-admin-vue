import { ElForm } from 'element-plus'

export type ElFormInstance = Pick<
  InstanceType<typeof ElForm>,
  'resetFields' | 'validate' | 'validateField' | 'scrollToField' | 'clearValidate'
>

export * from './form'
