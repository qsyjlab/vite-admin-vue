import { storeToRefs } from 'pinia'
import { type ComputedRef, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Menu } from '@/router/types'
import { useLayoutStore, usePermissionStore } from '@/store'

interface LayoutMenuProps {
  type: 'all' | 'top' | 'left'
}

export function useLayoutMenu(props?: ComputedRef<LayoutMenuProps>) {
  const { getMenus } = usePermissionStore()
  const { layoutConfig } = storeToRefs(useLayoutStore())

  const router = useRouter()

  const currentRoute = router.currentRoute
  const isSplitMenu = computed(() => layoutConfig.value.splitMenu)

  const menus = computed<Menu[]>(() => {
    const allMenus = getMenus()

    if (!isSplitMenu.value) return allMenus

    const type = props?.value.type
    const currentRootName = currentRoute.value.matched[0]?.name

    if (type === 'left') {
      return allMenus.find(i => i.name === currentRootName)?.children || []
    }

    if (type === 'top') {
      return allMenus.map(item => {
        return {
          ...item,
          children: []
        }
      })
    }

    return allMenus
  })

  return {
    menus
  }
}
