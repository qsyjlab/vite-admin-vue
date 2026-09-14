/** 视图统计演示数据：两种调用方式（hooks / 组件）共用同一份数据 */
export interface ViewStatisticsItem {
  count: number
  date: string
}

export const viewData: ViewStatisticsItem[] = [
  { count: 4, date: '2023-07-31' },
  { count: 0, date: '2023-08-01' },
  { count: 2, date: '2023-08-02' },
  { count: 0, date: '2023-08-03' },
  { count: 0, date: '2023-08-04' },
  { count: 0, date: '2023-08-05' },
  { count: 0, date: '2023-08-06' },
  { count: 9, date: '2023-08-07' },
  { count: 3, date: '2023-08-08' },
  { count: 0, date: '2023-08-09' },
  { count: 7, date: '2023-08-10' },
  { count: 1, date: '2023-08-11' },
  { count: 0, date: '2023-08-12' },
  { count: 0, date: '2023-08-13' },
  { count: 6, date: '2023-08-14' },
  { count: 4, date: '2023-08-15' }
]
