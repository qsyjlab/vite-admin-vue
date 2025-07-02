/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 项目标题 */
  readonly VITE_APP_TITLE: string
  /** 项目描述 */
  readonly VITE_APP_DESC: string
  // api base
  readonly VITE_APP_API_BASE_URL: string
  // 单点登录地址
  readonly VITE_CAS_BASE_URL: string
  // 启用单点登录
  readonly VITE_ENABLE_SSO: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any, any, any>
  export default component
}

/** 密钥文件后缀 */
declare module '*.pem' {
  const content: string
  export default content
}

/** app信息 */
declare const __APP_INFO__: Record<string, any>
