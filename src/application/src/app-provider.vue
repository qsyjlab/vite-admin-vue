<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

import { createBreakpointListener } from '@/hooks/event/use-breakpoint'
import { createAppProviderContext } from './context'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'

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

    createAppProviderContext({ isMobile })

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
