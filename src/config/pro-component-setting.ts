/** 对于 pro 系列 组件的 props 预设 */
import type { ProConfigProviderProps } from '@/components/pro-config-provider'

const componentSetting: ProConfigProviderProps = {
  proTable: {
    transform: data => ({ data: data.data, total: data.total }),
    transformParams: params => {
      return params
    }
  }
}

export default componentSetting
