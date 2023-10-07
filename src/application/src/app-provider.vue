<script lang="ts">
import { computed, defineComponent, ref, readonly, h } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

import { createBreakpointListener } from '@/hooks/event/use-breakpoint'
import { createAppProviderContext } from './context'
import { getLayoutCache } from '@/store/local'
import { useLayoutConfigHandler } from '@/hooks'

import projectConfig from '@/config/project-setting'
import config from '@/config'

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(props, { slots }) {
    const route = useRoute()

    const isMobile = ref(false)

    initAppConfig()

    createBreakpointListener(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.XS)
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
        return `${route?.meta.title ? route?.meta.title + ' -' : ''}${config.projectTitle}`
      })
    )

    function initAppConfig() {
      const { initLayout } = useLayoutConfigHandler()
      initLayout(getLayoutCache() || {})
    }

    return () => h(ElConfigProvider, { locale: zhCn }, () => slots.default?.())
  }
})
</script>
