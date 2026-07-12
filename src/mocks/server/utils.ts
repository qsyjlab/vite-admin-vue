import type { IncomingMessage, ServerResponse } from 'node:http'

/** 统一 JSON 响应 */
export function sendJson(response: ServerResponse, data: unknown, statusCode = 200) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(data))
}

/** 成功响应体 */
export function success(data: unknown, message = '') {
  return { code: 200, data, message }
}

/** 失败响应体 */
export function failure(message: string, code = 0, data: unknown = null) {
  return { code, data, message }
}

/** 读取请求体 JSON */
export async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (!chunks.length) return {}

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
  } catch {
    return {}
  }
}
