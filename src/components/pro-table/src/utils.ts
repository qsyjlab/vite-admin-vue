import { ColumnsMap } from './types'

export function sliceData(data: any, { pageNum = 1, pageSize = 10 }) {
  const start = (pageNum - 1) * pageSize
  return data.slice(start, start + pageSize)
}

export function columnsSort(map: ColumnsMap) {
  return (a: any, b: any) => {
    const aOrder = map[a.key]?.order || 0
    const bOrder = map[b.key]?.order || 0

    return aOrder - bOrder
  }
}
