declare namespace Api {
  export interface IPage<T> {
    total: number
    pageSize: number
    curPage: number
    list: T[]
  }

  export type IPageQuery<T = unknown> = {
    page?: number
    pageSize?: number
  } & T

  export interface Result<T = any> {
    data?: T
    code?: number
    message?: string
  }
}
