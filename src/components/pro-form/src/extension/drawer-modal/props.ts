import { definePropType } from '@/utils'
import type { DrawerProps } from 'element-plus'
import { FormSchema } from '../../form-props'

export default {
  direction: {
    type: definePropType<DrawerProps['direction']>(String),
    default: 'rtl'
  },
  title: {
    type: String,
    default: ''
  },
  fields: {
    type: definePropType<FormSchema[]>(Array),
    default: () => []
  }
}
