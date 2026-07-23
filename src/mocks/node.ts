import { setupServer } from 'msw/node'

import { handlers } from './server/handlers'

/**
 * MSW Node server —— 供 vitest 集成测试使用，与浏览器共用同一套 handlers
 *
 * 用法（在需要 mock 的测试文件内按需启用，不要全局 setup，避免破坏无环境纯函数测试）：
 *
 *   import { server } from '@/mocks/node'
 *   import { beforeAll, afterEach, afterAll } from 'vitest'
 *
 *   beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
 *   afterEach(() => server.resetHandlers())
 *   afterAll(() => server.close())
 */
export const server = setupServer(...handlers)
