import { h, defineComponent, KeepAlive } from 'vue'

import type { Component, VNode } from 'vue'
import { RouterView } from 'vue-router'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useRouteStore } from '@/store'

interface RouteViewDefaultSlotProps {
  Component: VNode
  route: RouteLocationNormalizedLoaded
}

export default (name: string, alive = true): Component => {
  return defineComponent({
    name,
    setup() {
      const routeStore = useRouteStore()
      return () =>
        h(
          RouterView,
          {},
          {
            default: (props: RouteViewDefaultSlotProps) => {
              if (alive)
                return h(
                  KeepAlive,

                  {
                    include: routeStore.getAlive(name)
                  },
                  props.Component
                )
              return () => h(props.Component)
            }
          }
        )
    }
  })
}
