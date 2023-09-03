// 组件权限
const componentsModuleRoute = {
  name: 'Components',
  path: '/components',
  meta: {
    title: '组件',
    sort: 4,
    icon: 'icon-document'
  },
  redirect: { name: 'Form' },
  children: [
    {
      name: 'Anchor',
      path: 'anchor',
      meta: {
        title: '锚点'
      }
    },
    {
      name: 'Segmented',
      path: 'segmented',
      meta: {
        title: 'segmented 分段器'
      }
    },
    {
      name: 'ProTable',
      path: 'pro-table',
      meta: {
        title: 'ProTable'
      },
      children: [
        {
          name: 'ProTableBasic',
          path: 'pro-table-basic',
          meta: {
            title: 'ProTable 基本使用'
          }
        }
      ]
    },

    {
      name: 'Editor',
      path: 'editor',
      meta: {
        title: '编辑器'
      },
      redirect: { name: 'RichEditor' },
      children: [
        {
          name: 'RichEditor',
          path: 'rich-editor',
          meta: {
            title: 'tinymce富文本'
          }
        }
      ]
    },

    {
      name: 'ProForm',
      path: 'pro-form',
      meta: {
        title: 'ProForm',

        isKeepAlive: true,
        icon: 'icon-upload'
      },
      children: [
        {
          name: 'ProFormBase',
          path: 'base',
          meta: {
            title: '基础表单',

            isKeepAlive: true,
            icon: 'icon-upload'
          }
        },
        {
          name: 'ProFormModal',
          path: 'modal',
          meta: {
            title: 'Modal 表单',

            isKeepAlive: true,
            icon: 'icon-upload'
          }
        },
        {
          name: 'ProFormDrawer',
          path: 'drawer',
          meta: {
            title: 'Drawer 表单',

            isKeepAlive: true,
            icon: 'icon-upload'
          }
        },
        {
          name: 'ProFormSteps',
          path: 'steps',
          meta: {
            title: 'StepsForm 表单',

            isKeepAlive: true,
            icon: 'icon-upload'
          }
        }
      ]
    },
    {
      name: 'Upload',
      path: 'upload',
      meta: {
        title: '上传',

        icon: 'icon-list'
      }
    },
    {
      name: 'DargSort',
      path: 'drag-sort',
      meta: {
        title: '拖拽排序',

        icon: 'icon-cellphone'
      }
    },
    {
      name: 'Table',
      path: 'table',
      meta: {
        title: '表格',

        icon: 'icon-cellphone'
      }
    }
  ]
}

// 功能
const featureModuleRoute = {
  name: 'Feature',
  path: '/feature',
  meta: {
    title: '功能',
    icon: 'icon-document'
  },
  redirect: '/feature/watermark',
  children: [
    {
      name: 'Watermark',
      path: 'watermark',
      meta: {
        title: '水印'
      }
    },
    {
      name: 'Qrcode',

      meta: {
        title: '二维码'
      }
    },
    {
      name: 'TabPage',
      path: 'tab-page',
      meta: {
        title: '标签栏'
      },
      children: [
        {
          name: 'TabPageDetail',
          meta: {
            title: '标签栏详情'
          }
        }
      ]
    },
    {
      name: 'ImageViewer',
      path: 'image-viewer',
      meta: {
        title: '图片预览'
      }
    }
  ]
}

// welcome
const welcomeModuleRoute = {
  path: '/welcome',
  name: 'Welcome',
  meta: {
    title: 'Welcome',
    sort: 1,
    icon: 'icon-home-filled',
    hideChildrenInMenu: true
  },
  redirect: {
    name: 'WelcomeIndex'
  },
  children: [
    {
      path: 'index',
      name: 'WelcomeIndex',
      meta: {
        title: 'Welcome',
        sort: 1,
        icon: 'icon-home-filled'
      }
    }
  ]
}

// dashboard
const dashboardModuleRoute = {
  path: '/dashboard',
  name: 'Dashboard',
  meta: {
    title: 'Dashboard',
    sort: 2,
    icon: 'icon-stopwatch'
  },
  redirect: {
    name: 'DashboardIndex'
  },
  children: [
    {
      path: 'index',
      name: 'DashboardIndex',
      meta: {
        title: 'Dashboard',
        sort: 2,
        icon: 'icon-stopwatch'
      }
    }
  ]
}

// outpage
const outPageModuleRoute = {
  name: 'OutPage',
  path: '/out-page',
  meta: {
    sort: 7,
    title: '外部页面'
  },
  children: [
    {
      name: 'OutLink',
      path: 'out-link',
      meta: {
        title: '外链'
      }
    },
    {
      name: 'Iframe',
      path: 'iframe',
      meta: {
        isKeepAlive: true,

        title: 'iframe'
      }
    }
  ]
}

// pluginModule

const pluginModuleRoute = {
  name: 'Plugins',
  path: '/plugins',
  meta: {
    title: '插件',
    sort: 3,
    icon: 'icon-files'

    // hideChildrenInMenu: true
  },
  redirect: { name: 'DayJs' },
  children: [
    {
      name: 'DayJs',
      path: 'dayjs',
      meta: {
        title: 'DayJs',
        icon: 'icon-timer'
      }
    },
    {
      name: 'CanvsToPdf',
      path: 'canvs-to-pdf',
      meta: {
        title: 'CanvsToPdf',
        icon: 'icon-camera-filled'
      }
    }
  ]
}

export const allRouteModules = [
  welcomeModuleRoute,
  dashboardModuleRoute,
  featureModuleRoute,
  componentsModuleRoute,
  pluginModuleRoute,
  outPageModuleRoute
]

export const permissionsMap = {
  fakeToken1: allRouteModules,
  fakeToken2: []
}

function getStringKeysDeep(routes: any[], keys: string[] = []) {
  routes.forEach((route: any) => {
    keys.push(route.name)
    if (route.children) {
      getStringKeysDeep(route.children, keys)
    }
  })

  return keys
}

export const allPermissionStringKeys = getStringKeysDeep(allRouteModules)

export interface RouteModule {
  name?: string
  path?: string
  meta?: {
    title?: string
    sort?: number
    // icon: 'icon-document'
  }
  redirect: string
  children?: RouteModule[]
}
