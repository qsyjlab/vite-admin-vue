/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-27 13:39:36
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 14:37:11
 */
type baseLocalStorageType = Storage

export { baseLocalStorageType }

export default class BaseStorage {
  localStorage: baseLocalStorageType
  prefix: string
  /**
   *
   * @param {*} Storage 缓存对象
   * @param {*} prefix 前缀
   */
  constructor(storage: baseLocalStorageType = window.localStorage, prefix: string) {
    this.localStorage = storage
    this.prefix = prefix ? prefix : ''
  }

  jointKey(key: string): string {
    return this.prefix + key
  }

  /**
   *
   * @param {*} key 缓存key
   * @returns json 对象
   */
  get<T>(key: string): T | null {
    const value = this.localStorage.getItem(this.jointKey(key))
    if (!value) return null
    return JSON.parse(value)
  }
  /**
   *
   * @param {*} key 缓存key
   * @param {*} value 缓存数
   */
  set(key: string, value: any): void {
    this.localStorage.setItem(this.jointKey(key), JSON.stringify(value))
  }

  /**
   *
   * @param {*} key
   */
  remove(key: string): void {
    this.localStorage.removeItem(this.jointKey(key))
  }

  /**
   * @returns void
   */
  clear(): void {
    return this.localStorage.clear()
  }
}
