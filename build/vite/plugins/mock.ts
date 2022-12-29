import { viteMockServe } from 'vite-plugin-mock'

export function viteMockPlugin(isBuild: boolean) {
  return viteMockServe({
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock/index';
      setupProdMockServer();
    `
  })
}
