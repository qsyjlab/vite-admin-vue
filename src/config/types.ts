import { readonly } from 'vue'

interface GlobalConfig {
  publicBaseUrl: string
  /** api url */
  baseApiUrl: string
  /** 单点登录地址 */
  casBaseUrl: string
  /** 是否启用 sso */
  enableSSO: boolean
  /** 项目名称 */
  projectTitle: string
  /** 项目描述 */
  projectDesc: string
  /** storage 相关变量配置 */
  storage: {
    prefix: string
  }
}

export function defineConfig(config: GlobalConfig) {
  return readonly(config)
}
