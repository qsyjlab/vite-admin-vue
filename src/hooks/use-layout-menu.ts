import { Menu } from '@/router/types'
import { useLayoutStore, usePermissionStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface LayoutMenuProps {
  type: 'all' | 'top' | 'left'
}

export function useLayoutMenu(props?: ComputedRef<LayoutMenuProps>) {
  const { getMenus } = usePermissionStore()
  const { layoutConfig } = storeToRefs(useLayoutStore())

  // const menus = ref<Menu[]>()
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
