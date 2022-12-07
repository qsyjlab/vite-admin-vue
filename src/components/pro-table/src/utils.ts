export function sliceData(data: any, { pageNum = 1, pageSize = 10 }) {
  const start = (pageNum - 1) * pageSize
  return data.slice(start, start + pageSize)
}
