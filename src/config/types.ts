import { readonly } from '@/utils'

interface GlobalConfig {
  baseApiUrl: string
}

export function defineConfig(config: GlobalConfig) {
  return readonly(config)
}
