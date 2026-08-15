/**
 * Mock 入口 —— 基于 MSW (Mock Service Worker)
 *
 * 开关逻辑（VITE_ENABLE_MOCK）：
 * - 'true'  → dev + prod 都启用
 * - 'false' → 完全关闭，走真实后端
 * - 未设置  → 默认 dev 启用、prod 关闭（兼容行为）
 *
 * onUnhandledRequest: 'bypass' 让未注册的请求（vite 资源/HMR/动态 import/真实接口）原样放行，
 * 由 MSW 转发到网络层，不返回 mock 响应。
 */

/**
 * 清理浏览器中可能残留的旧 Service Worker 注册
 * 历史上本项目用过其它 SW 方案，迁移 MSW 前需先注销，避免旧 SW 干扰
 */
async function cleanupLegacyWorkers() {
  if (!('serviceWorker' in navigator)) return
  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map(reg => reg.unregister()))
}

export async function enableMock() {
  const flag = import.meta.env.VITE_ENABLE_MOCK
  const enabled = flag === 'true' || (flag !== 'false' && import.meta.env.DEV)
  if (!enabled) return

  // 先清理旧 SW，避免残留注册干扰 MSW
  await cleanupLegacyWorkers()

  const { worker } = await import('./browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true
  })
}
