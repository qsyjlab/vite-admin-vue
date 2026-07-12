/** 对于 pro 系列 组件的 props 预设 */
import type { ProConfigProviderProps } from '@vite-admin/pro-components'

const componentSetting: DeepPartial<ProConfigProviderProps> = {
  size: 'default',
  field: {
    emptyText: '-'
  },
  table: {
    responseAdapter: response => {
      const result = response as { data: object[]; total: number }
      return { data: result.data, total: result.total }
    },
    transformParams: params => {
      return params
    }
  },
  descriptions: {
    border: true,
    column: { xs: 1, sm: 2, md: 3 }
  },
  card: {
    bordered: true,
    shadow: 'never'
  },
  list: {
    layout: 'list',
    bordered: true,
    emptyText: '暂无列表数据'
  }
}

export default componentSetting
