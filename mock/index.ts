import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import mocks from './user'

export function setupProdMockServer() {
  createProdMockServer([...mocks])
}
