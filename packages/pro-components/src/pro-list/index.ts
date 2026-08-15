import { withInstall } from '../shared/with-install'
import ProListComponent from './pro-list.vue'

export const ProList = withInstall(ProListComponent)

export * from './pro-list'
export * from './pro-list-utils'
export * from './use-pro-list'

export default ProList
