/*
 * @Description: 系统变量全局声明文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-04-02 23:12:35
 * @FilePath: \vite-admin-vue\src\env.d.ts
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 项目基本地址 */
  BASE_URL: string
  /** 项目名称 */
  readonly VITE_APP_NAME: string
  /** 项目标题 */
  readonly VITE_APP_TITLE: string
  /** 项目描述 */
  readonly VITE_APP_DESC: string
  /** 当前模式 */
  readonly VITE_MODE: string
  // 基本路径
  readonly VITE_APP_BASE_URL: string

  // api base
  readonly VITE_APP_API_BASE_URL: string
  // 文件路径
  readonly VITE_APP_FILE_URL: string

  // localstorage 前缀
  readonly VITE_APP_LOCALSTORAGE_PREFIX: string

  // localstorage 过期时间
  readonly VITE_APP_LOCALSTORAGE_EXPIRES: number

  // auth 前缀
  readonly VITE_APP_AXIOS_HEADERS_AUTHRIZATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
