export function isFullScreen() {
  return !!(
    document.fullscreenElement ||
    //@ts-ignore 处理兼容性 标准库没有
    document.webkitFullscreenElement ||
    //@ts-ignore
    document.mozFullScreenElement ||
    //@ts-ignore
    document.msFullscreenElement
  )
}
