import { h, defineComponent, KeepAlive } from 'vue'
import { RouterView } from 'vue-router'
import { Transition } from '@/components'
import { useRouteStore, useTabPageStore } from '@/store'
import projectSetting from '@/config/project-setting'
import type { Component, VNode } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

interface RouteViewDefaultSlotProps {
  Component: VNode
  route: RouteLocationNormalizedLoaded
}

export default (name: string): Component => {
  const isAlive = projectSetting.keepAliveCachePolicy !== 'never'

  return defineComponent({
    name,
    setup() {
      const routeStore = useRouteStore()
      const tabPage = useTabPageStore()

      return () =>
        h(
          RouterView,
          {},
          {
            default: (props: RouteViewDefaultSlotProps) => {
              if (isAlive) {
                const include =
                  projectSetting.keepAliveCachePolicy === 'normal'
                    ? routeStore.getAliveCache
                    : tabPage.getKeepAliveCache

                return h(Transition, {}, () =>
                  h(
                    KeepAlive,
                    {
                      include
                    },
                    h(props.Component, { key: props.route.fullPath })
                  )
                )
              }

              return h(Transition, {}, h(props.Component, { key: props.route.fullPath }))
            }
          }
        )
    }
  })
}
