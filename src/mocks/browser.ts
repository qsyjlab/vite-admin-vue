import { setupWorker } from 'msw/browser'

import { handlers } from './server/handlers'

/**
 * MSW 浏览器 worker —— 拦截 /basic-api/* 请求，未注册的请求自动放行（onUnhandledRequest: 'bypass'）
 *
 * 使用方式：在 main.ts 中按开关调用 worker.start()
 */
export const worker = setupWorker(...handlers)
