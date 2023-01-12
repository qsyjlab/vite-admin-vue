import type { MockMethod, Recordable } from 'vite-plugin-mock'

export function resultSuccess<T = Record<string, any> | null>(data: T, message?: string) {
  if (!data) return responseFormatter(null, message)
  return responseFormatter(data, message || null)
}

export function resultError(message = 'faild') {
  return responseFormatter(null, message, 0)
}

export function responseFormatter(
  data: Record<string, any> | null,
  message?: string | null,
  code = 200
) {
  return {
    code,
    data,
    message
  }
}

interface MockPluginMethodOptions<T> {
  url: Recordable
  body: T
  query: Recordable
  headers: Recordable
}
export interface MockPluginMethod extends MockMethod {
  response?: <T = any>(opt: MockPluginMethodOptions<T>) => any
}
