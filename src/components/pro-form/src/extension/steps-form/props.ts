import { definePropType } from '@/utils'
import { FormSchema } from '../../form-props'

interface StepsItem {
  title: string
  form: FormSchema[]
  beforeNext?: (currentValues: Record<string, any>, done: () => void) => void
}

type Steps = StepsItem[]

export default {
  steps: {
    type: definePropType<Steps>(Array),
    default: () => []
  }
}
