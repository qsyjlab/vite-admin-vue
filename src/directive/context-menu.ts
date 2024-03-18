import { ProContextMenuProps, ProContextMenu } from '@/components/context-menu'

import { Directive, h, render } from 'vue'

export const contextMenuDirective: Directive<HTMLElement, ProContextMenuProps> = (el, binding) => {
  const menuVnode = h(ProContextMenu, { ...binding.value })

  const trigger = binding.value.trigger || ['contextmenu']

  render(menuVnode, document.createElement('div'))

  function triggerEvent(event: Event) {
    event.preventDefault()
    menuVnode.component?.exposed?.show?.(event)
  }

  trigger.forEach(tg => {
    el.addEventListener(tg, triggerEvent)
  })
}
