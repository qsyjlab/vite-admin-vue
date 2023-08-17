declare type Nullable<T> = T | null

declare type NOOP = () => void

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
