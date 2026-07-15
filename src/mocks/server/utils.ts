import type { IncomingMessage, ServerResponse } from 'node:http'
import { TextDecoder, TextEncoder } from 'node:util'

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
  const chunks: Uint8Array[] = []

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : new Uint8Array(chunk))
  }

  if (!chunks.length) return {}

  try {
    const length = chunks.reduce((total, chunk) => total + chunk.byteLength, 0)
    const body = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) {
      body.set(chunk, offset)
      offset += chunk.byteLength
    }
    return JSON.parse(new TextDecoder().decode(body)) as Record<string, unknown>
  } catch {
    return {}
  }
}
