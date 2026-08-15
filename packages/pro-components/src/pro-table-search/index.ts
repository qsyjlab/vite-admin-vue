import { withInstall } from '../shared/with-install'
import ProTableSearchComponent from './pro-table-search.vue'
import ProTableWithSearchComponent from './pro-table-with-search.vue'

export const ProTableSearch = withInstall(ProTableSearchComponent)
export const ProTableWithSearch = withInstall(ProTableWithSearchComponent)

export * from './pro-table-search'
export * from './pro-table-search-utils'
export * from './pro-table-with-search'
export * from './use-pro-table-search'

export default ProTableSearch
