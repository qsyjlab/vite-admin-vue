import { withInstall } from '../shared/with-install'
import ProConfigProviderComponent from './pro-config-provider.vue'

export const ProConfigProvider = withInstall(ProConfigProviderComponent)

export * from './pro-config-provider'
export * from './use-pro-config-provider'

export default ProConfigProvider
