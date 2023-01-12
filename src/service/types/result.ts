export interface Result<T = any> {
  data?: T
  code?: number
  message?: string
}
