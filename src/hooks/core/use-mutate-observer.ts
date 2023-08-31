import { nextTick, onBeforeUnmount, watch } from 'vue'

const defaultOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributeFilter: ['style', 'class']
}

export function useMutateObserver(
  nodeOrList: HTMLElement | HTMLElement[],
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions
) {
  let instance: MutationObserver

  watch(
    [() => nodeOrList, () => options],
    () => {
      console.log('watch')

      const nodeList = Array.isArray(nodeOrList) ? nodeOrList : [nodeOrList]
      if ('MutationObserver' in window) {
        instance = new MutationObserver(callback)
        nodeList.forEach(element => {
          instance.observe(element, options)
        })
      }
    },
    {
      immediate: true
    }
  )

  onBeforeUnmount(() => {
    nextTick(() => {
      instance?.takeRecords()
      instance?.disconnect()
    })
  })
}
