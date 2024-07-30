import { ProTableColumnItem } from '../types'

export const DEFAULT_PAGINATON_CONFIG = {
  pageSizes: [10, 20, 30, 40],
  background: true,
  layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
}

export const DEFAULT_PAGE_SIZE = 10

const INDEX_BORDER_KEY = '__table_index_border'

export const DEFAULT_INDEX_BORDER: ProTableColumnItem = {
  title: '序号',
  key: INDEX_BORDER_KEY,
  valueType: 'indexBorder',
  width: 70
}
