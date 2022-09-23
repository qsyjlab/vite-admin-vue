export interface RemLayoutOptions {
  clientWidth?: number
  base?: number
  event?: keyof WindowEventMap
  originSize?: number
}

// rem layout
export function useRemLayout(options: RemLayoutOptions = {}) {
  const { clientWidth = 1920, base = 100, event = 'resize', originSize = 16 } = options

  const docEl = document.documentElement
  const _originSize = docEl.style.fontSize

  function resize() {
    let _clientWidth = docEl.clientWidth

    if (!_clientWidth) return
    if (_clientWidth > clientWidth) {
      _clientWidth = clientWidth
    }

    const scale = _clientWidth / clientWidth
    docEl.style.fontSize = base * scale + 'px'
  }

  function stopObserverSize() {
    if (!_originSize) {
      document.documentElement.style.fontSize = ''
      // document.getElementsByTagName('html')[0].style.fontSize = ''
    } else {
      document.documentElement.style.fontSize = _originSize + 'px'
    }

    window?.removeEventListener(event, resize)
  }

  function observerSize() {
    resize()
    window?.addEventListener(event, resize, false)

    return stopObserverSize
  }

  return { observerSize, stopObserverSize }
}
