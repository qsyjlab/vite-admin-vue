<script lang="ts">
import { computed, defineComponent, ref, readonly } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { createBreakpointListener } from '@/hooks/event/use-breakpoint'
import { createAppProviderContext } from './context'

import projectConfig from '@/config/project-setting'

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(props, { slots }) {
    const route = useRoute()

    const isMobile = ref(false)

    createBreakpointListener(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.MD)
      if (lgWidth) {
        isMobile.value = width.value - 1 < lgWidth
      }
    })

    createAppProviderContext({ isMobile, projectConfig: readonly(projectConfig) })

    /**
     * 自动改变浏览器 document.title
     */
    useTitle(
      computed(() => {
        return route?.meta.title
      })
    )

    return () => slots.default?.()
  }
})
</script>
