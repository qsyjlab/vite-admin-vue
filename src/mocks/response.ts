import { HttpResponse } from 'msw'

export function success<T = Record<string, any> | null>(data: T, message = '') {
  return HttpResponse.json({
    code: 200,
    data,
    message
  })
}

export function failure(message = 'failed', code = 0, status = 200) {
  return HttpResponse.json(
    {
      code,
      data: null,
      message
    },
    { status }
  )
}
