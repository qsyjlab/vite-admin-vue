/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 项目标题 */
  readonly VITE_APP_TITLE: string
  /** 项目描述 */
  readonly VITE_APP_DESC: string
  // api base
  readonly VITE_APP_API_BASE_URL: string
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
