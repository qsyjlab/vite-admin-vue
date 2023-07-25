import { definePropType } from '@/utils'
import type { DialogProps } from 'element-plus'
import type { FormSchema } from '../../types'

export const modalProps = {
  width: {
    type: definePropType<DialogProps['width']>([String, Number]),
    default: '40%'
  },
  title: {
    type: definePropType<DialogProps['title']>(String),
    default: ''
  },
  fields: {
    type: definePropType<FormSchema[]>(Array),
    default: () => []
  }
}
