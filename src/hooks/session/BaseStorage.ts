type BaseLocalStorageType = Storage

interface OptionsType {
  expires: number
  prefix: string
}

type TimeStampType = number | undefined

interface DataFormatterType {
  value: any
  timeStamp: TimeStampType
}

interface SetOptionsType {
  isForever: boolean
}

export { BaseLocalStorageType }

export default class BaseStorage {
  localStorage: BaseLocalStorageType
  prefix: string
  expires: number

  /**
   *
   * @param { BaseLocalStorageType } storage
   * @param {OptionsType}  options
   */
  constructor(storage: BaseLocalStorageType = window.localStorage, options: OptionsType) {
    const { prefix, expires } = options

    this.localStorage = storage
    this.prefix = prefix
    this.expires = expires
  }

  /**
   *
   * @param {String} key 缓存key
   * @returns { T | null } json 对象
   */
  get<T>(key: string): T | null {
    const value = this.localStorage.getItem(this.jointKey(key))

    if (!value) return null

    const data: DataFormatterType = JSON.parse(value)

    if (this.isExpires(data.timeStamp)) return null

    return data.value
  }
  /**
   *
   * @param {String} key 缓存key
   * @param {*} value 缓存数据
   */
  set(key: string, value: any, options?: SetOptionsType): void {
    const { isForever } = options || {}

    this.localStorage.setItem(this.jointKey(key), this.dataFormatter(value, isForever))
  }

  /**
   * 移除key
   * @param {*} key
   */
  remove(key: string): void {
    this.localStorage.removeItem(this.jointKey(key))
  }

  /**
   * 清除廍
   */
  clearAll(): void {
    this.localStorage.clear()
  }

  jointKey(key: string): string {
    return this.prefix + key
  }

  /**
   * 默认存贮格式
   * @param {*}  data
   * @returns
   */
  dataFormatter(data: any, isForever = false): string {
    const value: DataFormatterType = {
      value: data,
      timeStamp: isForever ? undefined : new Date().getTime()
    }

    return JSON.stringify(value)
  }

  /**
   * token是否过期
   * @param {Number} timeStamp
   * @returns
   */
  isExpires(timeStamp: TimeStampType): boolean {
    // 无时间戳 永久保存
    if (!timeStamp) return false

    if (new Date().getTime() <= timeStamp) return true

    return false
  }
}
