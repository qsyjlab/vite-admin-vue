export function isSupportClipboard() {
  return navigator.clipboard && window.isSecureContext
}
