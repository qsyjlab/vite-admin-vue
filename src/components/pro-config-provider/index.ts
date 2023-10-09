import { withInstall } from '@/utils'
import ProConfigProviderComponent from './src/pro-config-provider.vue'

export const ProConfigProvider = withInstall(ProConfigProviderComponent)

export default ProConfigProvider

export * from './src/types'
