import { withInstall } from '../shared/with-install'
import ProCardComponent from './pro-card.vue'
import ProStatisticCardComponent from './pro-statistic-card.vue'

export const ProCard = withInstall(ProCardComponent)
export const ProStatisticCard = withInstall(ProStatisticCardComponent)

export * from './pro-card'
export * from './pro-card-utils'
export * from './use-pro-card'

export default ProCard
