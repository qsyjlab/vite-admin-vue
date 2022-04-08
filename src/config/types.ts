/*
 * @Description:config type
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-04-02 23:11:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-04-08 22:03:11
 */

export interface UrlType {
  baseUrl: {
    system: string
  }
  fileUrl: {
    file: string
  }
}

export interface ReadOnlyConfig {
  readonly storage: {
    prefix: string
    expires: number
  }
  readonly axios: {
    headers: {
      Authorization: string
    }
  }
  readonly url: UrlType
}
