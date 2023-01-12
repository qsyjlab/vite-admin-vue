interface LogRequestError {
  method?: string
  fullpath?: string
  message?: string
  code?: string | number
}

export function logRequestError(options: LogRequestError = {}) {
  const { method, fullpath, message, code } = options
  defaultOnError(`${method} ${fullpath} ${code} (${message})`)
}

export function defaultOnError(msg: string) {
  console.error(`[Vue error] ${msg}`)
}
