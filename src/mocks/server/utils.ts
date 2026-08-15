/**
 * Mock 响应体辅助函数
 *
 * 与原 Vite middleware 方案保持一致的响应结构 { code, data, message }，
 * 由 MSW 的 HttpResponse.json() 包裹后返回。
 */

/** 成功响应体 */
export function success(data: unknown, message = '') {
  return { code: 200, data, message }
}

/** 失败响应体 */
export function failure(message: string, code = 0, data: unknown = null) {
  return { code, data, message }
}
