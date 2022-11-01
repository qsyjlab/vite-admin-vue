/**
 * cookie
 */

export default class BaseCookie {
  del(key: string) {
    const date = new Date()
    date.setTime(date.getTime() - 1)
    const delValue = this.get(key)
    if (delValue) {
      document.cookie = key + '=' + delValue + ';expires=' + date.toUTCString()
    }
  }
  /**
   * 设置cookie
   * @param {*} name
   * @param {*} value
   */

  set(name: string, value: any) {
    const Days = 30
    const exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toUTCString()
  }
  /**
   * 获取cookie
   * @param {*} cookie_name
   */
  get(name: string) {
    const arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
    if (arr !== null) return decodeURIComponent(arr[2])
    return false
  }
}
