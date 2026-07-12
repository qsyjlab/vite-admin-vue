import type { Plugin } from 'vite'
import { handleMockRequest, handleMockNotFound } from '../../../src/mocks/server'

/**
 * Vite Mock API 插件 —— 薄包装层
 *
 * 实际的 mock 数据与路由处理器位于 src/mocks/server/，
 * 此插件仅负责将 Vite dev server 中间件对接到 mock 处理器。
 */
export function mockApiPlugin(apiBaseUrl: string): Plugin {
  const normalizedPrefix = String(apiBaseUrl || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
  const mockPrefix = normalizedPrefix ? `/${normalizedPrefix}` : ''

  return {
    name: 'vite-admin:mock-api',
    apply: 'serve',
    configureServer(server) {
      if (!mockPrefix) {
        server.config.logger.warn(
          '[vite:mock] VITE_APP_MOCK_API_BASE_URL is empty; mock API middleware is disabled.'
        )
        return
      }

      server.middlewares.use(async (request, response, next) => {
        if (!request.url) return next()

        const url = new URL(request.url, 'http://vite.local')
        if (url.pathname !== mockPrefix && !url.pathname.startsWith(`${mockPrefix}/`)) return next()

        const route = url.pathname.slice(mockPrefix.length)
        const method = request.method?.toUpperCase() || ''

        const handled = await handleMockRequest({
          url,
          method,
          route,
          request,
          response
        })

        if (!handled) {
          handleMockNotFound(response, method, route)
        }
      })
    }
  }
}
