export function getMousePosition(e: MouseEvent | TouchEvent) {
  const pos = {
    x: (e as MouseEvent).clientX,
    y: (e as MouseEvent).clientY
  }

  const touch = (e as TouchEvent).changedTouches

  if (touch) {
    pos.x = touch[0].clientX
    pos.y = touch[0].clientY
  }

  if (!pos.x || pos.x < 0) pos.x = 0

  if (!pos.y || pos.y < 0) pos.y = 0

  return pos
}

export function checkBoundaries(el: HTMLElement, x: number, y: number) {
  if (el) {
    const { innerWidth, innerHeight } = window
    const { offsetWidth, offsetHeight } = el

    if (x + offsetWidth > innerWidth) x -= x + offsetWidth - innerWidth

    if (y + offsetHeight > innerHeight) y -= y + offsetHeight - innerHeight
  }

  return { x, y }
}
