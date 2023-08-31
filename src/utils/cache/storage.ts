interface BaseStorageOptions {
  expire?: number
  prefix: string
}

type Expire = number | undefined

interface DataFormatterType {
  value: any
  expire: Expire
}

class BaseStorage {
  localStorage: Storage
  prefix: string
  expire?: number

  constructor(storage: Storage = window.localStorage, options: BaseStorageOptions) {
    const { prefix, expire } = options

    this.localStorage = storage
    this.prefix = prefix
    this.expire = expire
  }

  /**
   *
   * @param {String} key 缓存key
   * @param {*} value 缓存数据
   */
  set(key: string, value: any, expire?: number) {
    this.localStorage.setItem(this.getKey(key), this.dataFormatter(value, expire))
  }

  /**
   *
   * @param {String} key 缓存key
   * @returns { T | null } json 对象
   */
  get<T>(key: string): T | null {
    const value = this.localStorage.getItem(this.getKey(key))

    if (!value) return null

    try {
      const data: DataFormatterType = JSON.parse(value)

      if (this.isExpire(data.expire)) {
        this.remove(this.getKey(key))
        return null
      }
      return data.value
    } catch (error) {
      return null
    }
  }

  /**
   * 移除key
   * @param {sting} key
   */
  remove(key: string): void {
    this.localStorage.removeItem(this.getKey(key))
  }

  /**
   * 清除廍
   */
  clearAll(): void {
    this.localStorage.clear()
  }

  /**
   * 默认存贮格式
   * @param {*}  data
   * @returns
   */
  private dataFormatter(data: any, expire?: number): string {
    const value: DataFormatterType = {
      value: data,
      expire: expire
    }

    return JSON.stringify(value)
  }

  /**
   * 信息是否过期
   * @param {Number} timeStamp
   * @returns
   */
  isExpire(timeStamp: Expire) {
    // 无时间戳 永久保存
    if (!timeStamp) return false

    if (new Date().getTime() < timeStamp) return true

    return false
  }

  private getKey(key: string) {
    return this.prefix || '' + key
  }
}

interface StorageFnOptions {
  prefixKey?: string
  storage?: Storage
  expire?: number
}

export function createStorage(options?: StorageFnOptions) {
  const { prefixKey, expire, storage = window.localStorage } = options || {}
  return new BaseStorage(storage, {
    prefix: prefixKey || '',
    expire: expire
  })
}
