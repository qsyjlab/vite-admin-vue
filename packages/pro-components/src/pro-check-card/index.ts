import { withInstall } from '../shared/with-install'
import ProCheckCardComponent from './pro-check-card.vue'
import ProCheckCardGroupComponent from './pro-check-card-group.vue'

export const ProCheckCard = withInstall(ProCheckCardComponent)
export const ProCheckCardGroup = withInstall(ProCheckCardGroupComponent)
export * from './pro-check-card'
export * from './pro-check-card-utils'
export default ProCheckCard
