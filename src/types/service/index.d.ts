/*
 * @Description: service global declarations
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-13 01:00:14
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 11:53:58
 * @FilePath: \vite-admin-vue\src\types\service\index.d.ts
 */

declare namespace VService {
  enum MethodEnum {
    POST = 'post',
    GET = 'get',
    DELETE = 'delete',
    OPTIONS = 'options',
    PUT = 'put'
  }
  export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT'
}
