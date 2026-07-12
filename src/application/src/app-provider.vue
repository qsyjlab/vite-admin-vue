<script lang="ts">
import { computed, defineComponent, ref, readonly, h } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { createBreakpointListener } from '@/hooks/event/use-breakpoint'
import { createAppProviderContext } from './context'
import { useLayoutConfigHandler } from '@/hooks'

import projectConfig from '@/config/project-setting'
import proComponentSetting from '@/config/pro-component-setting'
import config from '@/config'

import { ProConfigProvider, registerProPreviewFileRenderer } from '@vite-admin/pro-components'
import { DocxPreview } from '@/components/docx-preview'
import { PdfPreview } from '@/components/pdf-preview'
import { XlsxPreview } from '@/components/xlsx-preview'
import { getLayoutCache } from '@/store/local'

registerProPreviewFileRenderer('docx', DocxPreview)
registerProPreviewFileRenderer('pdf', PdfPreview)
registerProPreviewFileRenderer('xlsx', XlsxPreview)

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
        sidebarTheme: defaultLayoutSetting.sidebarTheme,
        headerTheme: defaultLayoutSetting.headerTheme,
        darkMenuBackground: defaultLayoutSetting.darkMenuBackground,
        splitMenu: defaultLayoutSetting.splitMenu,
        showEmptySplitMenuSidebar: defaultLayoutSetting.showEmptySplitMenuSidebar,
        footerHeight: defaultLayoutSetting.footerHeight,
        sideMixFixedMenu: defaultLayoutSetting.sideMixFixedMenu
      })

      if (layoutConfigCache) {
        initLayout({
          ...layoutConfigCache
        })
      }
    }

    return () =>
      h(
        ElConfigProvider,
        { locale: zhCn },
        {
          default: () => h(ProConfigProvider, proComponentSetting, () => slots.default?.())
        }
      )
  }
})
</script>
