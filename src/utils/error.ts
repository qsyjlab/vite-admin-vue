interface LogRequestError {
  method?: string
  fullpath?: string
  message?: string
  code?: string | number
}

export function logRequestError(options: LogRequestError = {}) {
  const { method, fullpath, message, code } = options
  defaultOnError('AxiosRequest error:', `${method?.toUpperCase()} ${fullpath} ${code} (${message})`)
}

export function defaultOnError(name: string, msg: string) {
  console.error(`[${name}] ${msg}`)
}
