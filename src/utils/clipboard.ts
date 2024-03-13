import { isSupportClipboard } from './support'

interface CopyToClipboardOpitons {
  success?: () => void
  error?: () => void
}

export function copyToClipboard(text: string, options?: CopyToClipboardOpitons) {
  if (!isSupportClipboard()) return

  navigator.clipboard
    .writeText(text)
    .then(() => {
      options?.success?.()
    })
    .catch(() => {
      options?.error?.()
    })
}
