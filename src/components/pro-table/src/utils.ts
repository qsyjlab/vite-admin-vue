import type { ColumnsMap, ProTableProps } from './types'

export function sliceData(data: any, { page = 1, pageSize = 10 }) {
  const start = (page - 1) * pageSize
  return data.slice(start, start + pageSize)
}

export function columnsSort(map: ColumnsMap) {
  return (a: any, b: any) => {
    const aOrder = map[a.key]?.order || 0
    const bOrder = map[b.key]?.order || 0

    return aOrder - bOrder
  }
}

export function columnsFilter(columns: any[], columnsMap: any) {
  function filter(columns: any[]) {
    return columns
      .map(column => {
        const config = columnsMap[column.key] || {
          fixed: column.fixed
        }
        if (config && config.show === false) {
          return false
        }

        const tempColumn: any = {
          ...column,
          fixed: config.fixed,
          children: undefined
        }

        if (column.children && column.children?.length) {
          const children = filter(column.children)

          /**
           * 需要将父级列也移出去, 动态切换表头会出现列塌陷
           * doLayout 无效 ,doLayout 并没有重置 table 内部配置只是 高度大小
           */
          if (children.length) {
            tempColumn.children = children
          } else {
            return false
          }
        }
        return tempColumn
      })
      .filter(Boolean)
  }

  return filter(columns)
}

/** 获取到实际的 rowKey */
export function getRowkey(row: any, rowKey: ProTableProps['rowKey']): string | undefined {
  if (typeof rowKey === 'string') {
    return row[rowKey]
  }

  if (typeof rowKey === 'function') {
    return rowKey(row)
  }

  return void 0
}
