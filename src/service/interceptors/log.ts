// POST http://49.4.86.115:10104/api/login 422 (Unprocessable Content)

interface CustomStatusCodeError {
  method?: string
  fullpath?: string
  message?: string
  code?: string | number
}

export function customStatusCodeError(options: CustomStatusCodeError = {}) {
  const { method, fullpath, message, code } = options
  error(`${method} ${fullpath} ${code} (${message})`)
}

export function error(message: string) {
  console.error(`[BaseAxios error]: ${message}`)
}
