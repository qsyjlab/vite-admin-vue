import { readonly } from '@/utils'

interface GlobalConfig {
  /** api url */
  baseApiUrl: string
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
