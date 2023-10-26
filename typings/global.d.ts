declare type Nullable<T> = T | null

declare type NOOP = () => void

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
