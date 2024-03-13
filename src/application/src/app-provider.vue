<script lang="ts">
import { computed, defineComponent, ref, readonly, h } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { ElConfigProvider, ElProgress } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { createBreakpointListener } from '@/hooks/event/use-breakpoint'
import { createAppProviderContext } from './context'
import { useLayoutConfigHandler } from '@/hooks'

import projectConfig from '@/config/project-setting'
import proComponentSetting from '@/config/pro-component-setting'
import config from '@/config'

import ProConfigProvider from '@/components/pro-config-provider'
import { getLayoutCache } from '@/store/local'

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(_, { slots }) {
    const route = useRoute()

    const isMobile = ref(false)

    initAppConfig()

    createBreakpointListener(({ screen, sizeEnum }) => {
      if (screen.value === sizeEnum.XS) {
        isMobile.value = true
      } else {
        isMobile.value = false
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
      const layoutConfigCache = getLayoutCache()

      const defaultLayoutSetting = projectConfig.defaultLayoutSetting
      initLayout({
        layoutMode: defaultLayoutSetting.layoutMode,
        collapsed: defaultLayoutSetting.asideMenuCollapsed,
        asideWidth: defaultLayoutSetting.asideWidth,
        tabBarHeight: defaultLayoutSetting.tabBarHeight,
        headerHeight: defaultLayoutSetting.headerHeight,
        theme: projectConfig.theme,
        themeColor: projectConfig.themeColor,
        splitMenu: defaultLayoutSetting.splitMenu,
        footerHeight: defaultLayoutSetting.footerHeight,
        sideMixFixedMenu: defaultLayoutSetting.sideMixFixedMenu
      })
      layoutConfigCache && initLayout(layoutConfigCache)
    }

    return () =>
      h(
        ElConfigProvider,
        { locale: zhCn },
        {
          default: () =>
            h(
              ProConfigProvider,
              {
                proTable: {
                  ...proComponentSetting.proTable,
                  rendererMap: {
                    'custom-text': () => {
                      return '测试自定义渲染器'
                    },
                    'custom-render-componet': () => {
                      return defineComponent({
                        setup() {
                          return () => h(ElProgress, { percentage: 50 })
                        }
                      })
                    }
                  }
                }
              },
              () => slots.default?.()
            )
        }
      )
  }
})
</script>
