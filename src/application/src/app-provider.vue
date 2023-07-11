<script lang="ts">
import { defineComponent, ref } from 'vue'

import { createBreakpointListener } from '@/hooks/event/use-breakpoint'
import { createAppProviderContext } from './context'
export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(props, { slots }) {
    const isMobile = ref(false)

    createBreakpointListener(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.MD)
      if (lgWidth) {
        isMobile.value = width.value - 1 < lgWidth
      }
    })

    createAppProviderContext({ isMobile })

    return () => slots.default?.()
  }
})
</script>
