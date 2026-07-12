/**
 * Mock 认证数据 —— 支持三种权限模式的模拟登录
 *
 * 1. ROUTE_MAPPING（路由 name 映射）：用户拥有可访问的路由 name 列表
 * 2. ROLE（角色映射）：用户拥有角色，路由通过 meta.roles 控制访问
 * 3. BACKED（菜单映射 / 后端菜单）：后端返回菜单路由树，前端按后端数据渲染
 */

export type MockPermissionMode = 'ROUTE_MAPPING' | 'ROLE' | 'BACKED'

export interface MockRole {
  roleName: string
  value: string
}

export interface MockUser {
  userId: number
  username: string
  password: string
  realName: string
  desc: string
  token: string
  avatar?: string
  /** 路由 name 映射模式使用的权限列表 */
  permissions: string[]
  /** 角色映射模式使用的角色列表 */
  roles: MockRole[]
}

// ─── 路由 name 权限组（ROUTE_MAPPING 模式使用） ───────────────────────────

/** 全部路由 name —— 超级管理员 */
const allRouteNames = [
  'Welcome',
  'WelcomeIndex',
  'Dashboard',
  'DashboardIndex',
  'Charts',
  'Echarts',
  'Components',
  'ProTable',
  'ProTableBasic',
  'ProEditableTable',
  'ProTableSearch',
  'ProDragSortTable',
  'Editor',
  'ProCodeEditor',
  'RichEditor',
  'ProConfigProviderDemo',
  'ProCardDemo',
  'ProListDemo',
  'ProEmptyDemo',
  'ProSelectDemo',
  'ProRadioGroupDemo',
  'ProCheckboxGroupDemo',
  'ProFieldDemo',
  'ProForm',
  'ProFormBase',
  'ProFormRef',
  'ProFromDynamic',
  'ProFormModal',
  'ProFormDrawer',
  'ProFormSteps',
  'Upload',
  'Anchor',
  'Segmented',
  'ContextMenu',
  'Tree',
  'TreeSelect',
  'BaseTree',
  'Feature',
  'Watermark',
  'Qrcode',
  'TabPage',
  'TabPageDetail',
  'ImageViewer',
  'Download',
  'Message',
  'Encrypt',
  'Print',
  'Pdf',
  'PdfPreview',
  'Excel',
  'ExcelPreview',
  'ExcelBase',
  'ExcelBaseMutiHeader',
  'ExcelImport',
  'docx',
  'HtmlToDocx',
  'HtmlToDocxPreview',
  'OutPage',
  'OutLink',
  'Iframe',
  'Qiankun',
  'ReactSwc',
  'About',
  'AboutIndex',
  'Docs',
  'Exception',
  '404',
  '403',
  'System',
  'SystemMenu',
  'Examples',
  'RouteEngineExamples',
  'RouteEngineOverview',
  'RouteEngineAccess',
  'RouteEngineMenuProjection',
  'RouteEngineKeepAliveA',
  'RouteEngineKeepAliveB',
  'ProComponentsExamples',
  'OrderCrudExample',
  'DashboardListExample',
  'OperationMonitorExample',
  'ContentPublishExample'
]

/** 编辑者权限 —— 可访问工作台、图表、组件、功能模块，不可访问系统管理、示例中心 */
const editorRouteNames = [
  'Welcome',
  'WelcomeIndex',
  'Dashboard',
  'DashboardIndex',
  'Charts',
  'Echarts',
  'Components',
  'ProTable',
  'ProTableBasic',
  'ProEditableTable',
  'ProTableSearch',
  'ProDragSortTable',
  'Editor',
  'ProCodeEditor',
  'RichEditor',
  'ProCardDemo',
  'ProListDemo',
  'ProForm',
  'ProFormBase',
  'ProFormModal',
  'Upload',
  'Feature',
  'Watermark',
  'Qrcode',
  'TabPage',
  'ImageViewer',
  'Download',
  'Message',
  'Encrypt'
]

/** 访客权限 —— 仅可访问工作台和图表 */
const viewerRouteNames = [
  'Welcome',
  'WelcomeIndex',
  'Dashboard',
  'DashboardIndex',
  'Charts',
  'Echarts'
]

// ─── Mock 用户列表 ────────────────────────────────────────────────────────

export const mockUsers: MockUser[] = [
  {
    userId: 1,
    username: 'admin',
    password: '123456',
    realName: '超级管理员',
    desc: '拥有全部权限，三种模式下均可访问所有功能',
    token: 'mock-token-admin',
    permissions: allRouteNames,
    roles: [{ roleName: '超级管理员', value: 'super' }]
  },
  {
    userId: 2,
    username: 'editor',
    password: '123456',
    realName: '编辑者',
    desc: '可访问组件、功能、图表，不可访问系统管理与示例中心',
    token: 'mock-token-editor',
    permissions: editorRouteNames,
    roles: [{ roleName: '编辑者', value: 'editor' }]
  },
  {
    userId: 3,
    username: 'viewer',
    password: '123456',
    realName: '访客',
    desc: '仅可访问工作台与图表',
    token: 'mock-token-viewer',
    permissions: viewerRouteNames,
    roles: [{ roleName: '访客', value: 'viewer' }]
  }
]

// ─── 后端菜单树（BACKED 模式使用） ──────────────────────────────────────────
// 后端返回的路由模块，component 字段为字符串，由前端 transformObjToRoute 动态导入
// component 为 'LAYOUT' 表示使用布局组件，其余为 views 下的路径（不含 src/views 前缀）

/** admin —— 完整菜单 */
const adminBackendMenus = [
  {
    name: 'Welcome',
    path: '/welcome',
    component: 'LAYOUT',
    redirect: { name: 'WelcomeIndex' },
    meta: { title: '工作台', icon: 'ep.home-filled', order: 10, hideChildrenInMenu: true },
    children: [
      {
        name: 'WelcomeIndex',
        path: 'index',
        component: '/system/WelcomeTo',
        meta: { title: '工作台', icon: 'ep.home-filled', affixTab: true, hideInBreadcrumb: true }
      }
    ]
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: 'LAYOUT',
    redirect: { name: 'DashboardIndex' },
    meta: { title: 'Dashboard', icon: 'ep.stopwatch', order: 15, hideChildrenInMenu: true },
    children: [
      {
        name: 'DashboardIndex',
        path: 'index',
        component: '/system/WelcomeTo',
        meta: { title: 'Dashboard', icon: 'ep.stopwatch', hideInMenu: true }
      }
    ]
  },
  {
    name: 'Charts',
    path: '/charts',
    component: 'LAYOUT',
    redirect: { name: 'Echarts' },
    meta: { title: '图表', icon: 'ep.trend-charts', order: 20 },
    children: [
      {
        name: 'Echarts',
        path: 'echarts',
        component: '/system/charts/echarts/echarts',
        meta: { title: 'ECharts', icon: 'ep.data-line', order: 10 }
      }
    ]
  },
  {
    name: 'Components',
    path: '/components',
    component: 'LAYOUT',
    redirect: { name: 'ProTable' },
    meta: { title: '组件', icon: 'ep.grid', order: 30 },
    children: [
      {
        name: 'ProTable',
        path: 'pro-table',
        redirect: { name: 'ProTableBasic' },
        meta: { title: 'ProTable', icon: 'ep.list', order: 10 },
        children: [
          {
            name: 'ProTableBasic',
            path: 'pro-table-basic',
            component: '/system/components/pro-table/pro-table-page',
            meta: { title: 'ProTable 基本使用', icon: 'ep.tickets' }
          },
          {
            name: 'ProEditableTable',
            path: 'pro-editable-table',
            component: '/system/components/pro-editable-table/pro-editable-table-page',
            meta: { title: 'ProEditableTable', icon: 'ep.edit' }
          },
          {
            name: 'ProTableSearch',
            path: 'pro-table-search',
            component: '/system/components/pro-table-search/pro-table-search-page',
            meta: { title: 'ProTableSearch', icon: 'ep.search' }
          },
          {
            name: 'ProDragSortTable',
            path: 'pro-drag-sort-table',
            component: '/system/components/drag-sort-table/drag-sort-table',
            meta: { title: 'ProDragSortTable', icon: 'ep.rank' }
          }
        ]
      },
      {
        name: 'Editor',
        path: 'editor',
        redirect: { name: 'ProCodeEditor' },
        meta: { title: '编辑器', icon: 'ep.edit-pen', order: 30 },
        children: [
          {
            name: 'ProCodeEditor',
            path: 'pro-code-editor',
            component: '/system/components/pro-code-editor/pro-code-editor-page',
            meta: { title: 'ProCodeEditor', icon: 'ep.code', order: 10 }
          },
          {
            name: 'RichEditor',
            path: 'rich-editor',
            component: '/system/components/rich-editor/rich-editor',
            meta: { title: 'tinymce富文本', icon: 'ep.document' }
          }
        ]
      },
      {
        name: 'ProConfigProviderDemo',
        path: 'pro-config-provider',
        component: '/system/components/pro-config-provider/pro-config-provider-page',
        meta: { title: 'ProConfigProvider', icon: 'ep.setting', order: 21 }
      },
      {
        name: 'ProCardDemo',
        path: 'pro-card',
        component: '/system/components/pro-card/pro-card-page',
        meta: { title: 'ProCard', icon: 'ep.postcard', order: 22 }
      },
      {
        name: 'ProListDemo',
        path: 'pro-list',
        component: '/system/components/pro-list/pro-list-page',
        meta: { title: 'ProList', icon: 'ep.list', order: 23 }
      },
      {
        name: 'ProEmptyDemo',
        path: 'pro-empty',
        component: '/system/components/pro-empty/pro-empty-page',
        meta: { title: 'ProEmpty', icon: 'ep.box', order: 24 }
      },
      {
        name: 'ProSelectDemo',
        path: 'pro-select',
        component: '/system/components/pro-select/pro-select-page',
        meta: { title: 'ProSelect', icon: 'ep.select', order: 25 }
      },
      {
        name: 'ProRadioGroupDemo',
        path: 'pro-radio-group',
        component: '/system/components/pro-radio-group/pro-radio-group-page',
        meta: { title: 'ProRadioGroup', icon: 'ep.open', order: 26 }
      },
      {
        name: 'ProCheckboxGroupDemo',
        path: 'pro-checkbox-group',
        component: '/system/components/pro-checkbox-group/pro-checkbox-group-page',
        meta: { title: 'ProCheckboxGroup', icon: 'ep.finished', order: 27 }
      },
      {
        name: 'ProFieldDemo',
        path: 'pro-field',
        component: '/system/components/pro-field/pro-field-page',
        meta: { title: 'ProField', icon: 'ep.postcard', order: 28 }
      },
      {
        name: 'ProForm',
        path: 'pro-form',
        meta: { title: 'ProForm', icon: 'ep.memo', order: 20 },
        children: [
          {
            name: 'ProFormBase',
            path: 'base',
            component: '/system/components/pro-form/pro-form-page',
            meta: { title: '基础表单', icon: 'ep.document-add' }
          },
          {
            name: 'ProFormRef',
            path: 'ref',
            component: '/system/components/pro-form/pro-form-ref',
            meta: { title: '表单 ref 操作', icon: 'ep.pointer' }
          },
          {
            name: 'ProFromDynamic',
            path: 'dynamic',
            component: '/system/components/pro-form/dynamic',
            meta: { title: '动态表单', icon: 'ep.refresh-right' }
          },
          {
            name: 'ProFormModal',
            path: 'modal',
            component: '/system/components/pro-form/modal-form',
            meta: { title: 'Modal 表单', icon: 'ep.copy-document' }
          },
          {
            name: 'ProFormDrawer',
            path: 'drawer',
            component: '/system/components/pro-form/drawer-form',
            meta: { title: 'Drawer 表单', icon: 'ep.expand' }
          },
          {
            name: 'ProFormSteps',
            path: 'steps',
            component: '/system/components/pro-form/steps-form',
            meta: { title: 'StepsForm 表单', icon: 'ep.operation' }
          }
        ]
      },
      {
        name: 'Upload',
        path: 'upload',
        component: '/system/components/pro-upload/pro-upload-page',
        meta: { title: '上传', icon: 'ep.upload-filled', order: 40 }
      },
      {
        name: 'Anchor',
        path: 'anchor',
        component: '/system/components/anchor/anchor-demo',
        meta: { title: '锚点', icon: 'ep.position', order: 80 }
      },
      {
        name: 'Segmented',
        path: 'segmented',
        component: '/system/components/segmented/segmented',
        meta: { title: 'segmented 分段器', icon: 'ep.more-filled', order: 60 }
      },
      {
        name: 'ContextMenu',
        path: 'context-menu',
        component: '/system/components/context-menu/context-menu',
        meta: { title: '右键菜单', icon: 'ep.menu', order: 70 }
      },
      {
        name: 'Tree',
        path: 'tree',
        meta: { title: 'Tree', icon: 'ep.share', order: 50 },
        children: [
          {
            name: 'TreeSelect',
            path: 'tree-select',
            component: '/system/components/tree/tree-select',
            meta: { title: 'TreeSelect', icon: 'ep.connection' }
          },
          {
            name: 'BaseTree',
            path: 'base',
            component: '/system/components/tree/tree/tree',
            meta: { title: 'Tree', icon: 'ep.folder-opened' }
          }
        ]
      }
    ]
  },
  {
    name: 'Feature',
    path: '/feature',
    component: 'LAYOUT',
    redirect: '/feature/watermark',
    meta: { title: '功能', icon: 'svg.git-fork', order: 40 },
    children: [
      {
        name: 'Watermark',
        path: 'watermark',
        component: '/system/feature/watermark/watermark',
        meta: { title: '水印', icon: 'ep.postcard', order: 10 }
      },
      {
        name: 'Qrcode',
        path: 'qrcode',
        component: '/system/feature/qrcode/qrcode',
        meta: { title: '二维码', icon: 'ep.grid', order: 20 }
      },
      {
        name: 'TabPage',
        path: 'tab-page',
        component: '/system/feature/tab-page/tab-page',
        meta: { title: '标签栏', icon: 'ep.collection-tag', order: 30 }
      },
      {
        name: 'ImageViewer',
        path: 'image-viewer',
        component: '/system/feature/image-viwer/image-viwer',
        meta: { title: '图片预览', icon: 'ep.picture', order: 40 }
      },
      {
        name: 'Download',
        path: 'download',
        component: '/system/feature/download/download',
        meta: { title: '文件下载', icon: 'ep.download', order: 50 }
      },
      {
        name: 'Message',
        path: 'message',
        component: '/system/feature/message/message',
        meta: { title: '消息提示', icon: 'ep.chat-dot-round', order: 60 }
      },
      {
        name: 'Encrypt',
        path: 'encrypt',
        component: '/system/feature/encrypt/encrypt',
        meta: { title: '加密', icon: 'ep.lock', order: 70 }
      },
      {
        name: 'Print',
        path: 'print',
        component: '/system/feature/print/print',
        meta: { title: '打印', icon: 'ep.printer', order: 80 }
      },
      {
        name: 'Pdf',
        path: 'pdf',
        meta: { title: 'Pdf', icon: 'ep.document', order: 90 },
        children: [
          {
            name: 'PdfPreview',
            path: 'preview',
            component: '/system/feature/pdf/pdf-preview',
            meta: { title: '在线预览', icon: 'ep.view' }
          }
        ]
      },
      {
        name: 'Excel',
        path: 'excel',
        meta: { title: 'Excel', icon: 'ep.files', order: 100 },
        children: [
          {
            name: 'ExcelPreview',
            path: 'preview',
            component: '/system/feature/excel/preview',
            meta: { title: '在线预览', icon: 'ep.view' }
          },
          {
            name: 'ExcelBase',
            path: 'base',
            component: '/system/feature/excel/base/excel',
            meta: { title: '基本导出', icon: 'ep.download' }
          },
          {
            name: 'ExcelBaseMutiHeader',
            path: 'mutiple-header',
            component: '/system/feature/excel/mutiple-header/mutiple-header',
            meta: { title: '多表头', icon: 'ep.grid' }
          },
          {
            name: 'ExcelImport',
            path: 'import',
            component: '/system/feature/excel/import',
            meta: { title: '导入', icon: 'ep.upload' }
          }
        ]
      },
      {
        name: 'docx',
        path: 'docx',
        meta: { title: 'docx', icon: 'ep.document-copy', order: 110 },
        children: [
          {
            name: 'HtmlToDocx',
            path: 'html-to-docx',
            component: '/system/feature/docx/html-to-docx',
            meta: { title: '富文本导出docx', icon: 'ep.edit-pen' }
          },
          {
            name: 'HtmlToDocxPreview',
            path: 'html-to-docx-preview',
            component: '/system/feature/docx/docx-preview',
            meta: { title: '在线预览docx', icon: 'ep.view' }
          }
        ]
      }
    ]
  },
  {
    name: 'Examples',
    path: '/examples',
    component: 'LAYOUT',
    meta: { title: '示例中心', icon: 'ep.guide', order: 50 },
    children: [
      {
        name: 'RouteEngineExamples',
        path: 'route-engine',
        meta: { title: '路由与菜单', icon: 'ep.menu', order: 10 },
        children: [
          {
            name: 'RouteEngineOverview',
            path: 'overview',
            component: '/system/examples/route-engine/overview',
            meta: { title: '引擎概览', icon: 'ep.monitor', order: 10 }
          },
          {
            name: 'RouteEngineAccess',
            path: 'access-control',
            component: '/system/examples/route-engine/access-control',
            meta: { title: '登录与权限', icon: 'ep.lock', order: 20 }
          },
          {
            name: 'RouteEngineMenuProjection',
            path: 'menu-projection',
            component: '/system/examples/route-engine/menu-projection',
            meta: { title: '菜单投影', icon: 'ep.share', order: 30 }
          },
          {
            name: 'RouteEngineKeepAliveA',
            path: 'keep-alive-a',
            component: '/system/examples/route-engine/keep-alive-a',
            meta: { title: '缓存示例', icon: 'ep.coin', order: 40, isKeepAlive: true }
          },
          {
            name: 'RouteEngineKeepAliveB',
            path: 'keep-alive-b',
            component: '/system/examples/route-engine/keep-alive-b',
            meta: { title: '缓存验证', icon: 'ep.coin', hideInMenu: true, isKeepAlive: true }
          }
        ]
      },
      {
        name: 'ProComponentsExamples',
        path: 'pro-components',
        meta: { title: 'Pro 组件实战', icon: 'ep.grid', order: 20 },
        children: [
          {
            name: 'OrderCrudExample',
            path: 'order-crud',
            component: '/system/examples/pro-components/order-crud/order-crud-page',
            meta: { title: '订单 CRUD', icon: 'ep.shopping-cart', order: 10 }
          },
          {
            name: 'DashboardListExample',
            path: 'dashboard-list',
            component: '/system/examples/pro-components/dashboard-list/dashboard-list-page',
            meta: { title: '项目运营工作台', icon: 'ep.data-analysis', order: 20 }
          },
          {
            name: 'OperationMonitorExample',
            path: 'operation-monitor',
            component: '/system/examples/pro-components/operation-monitor/operation-monitor-page',
            meta: { title: '运营监控中心', icon: 'ep.monitor', order: 30 }
          },
          {
            name: 'ContentPublishExample',
            path: 'content-publish',
            component: '/system/examples/pro-components/content-publish/content-publish-page',
            meta: { title: '内容发布工作台', icon: 'ep.edit-pen', order: 40 }
          }
        ]
      }
    ]
  },
  {
    name: 'System',
    path: '/system',
    component: 'LAYOUT',
    redirect: { name: 'SystemMenu' },
    meta: { title: '系统管理', icon: 'ep.setting', order: 60, roles: ['super'] },
    children: [
      {
        name: 'SystemMenu',
        path: 'menu',
        component: '/system/system/menu/menu',
        meta: { title: '菜单管理', icon: 'ep.menu', order: 10 }
      }
    ]
  },
  {
    name: 'OutPage',
    path: '/out-page',
    component: 'LAYOUT',
    redirect: { name: 'Iframe' },
    meta: { title: '外部页面', icon: 'ep.link', order: 70 },
    children: [
      {
        name: 'OutLink',
        path: 'out-link',
        meta: {
          title: '外链',
          icon: 'ep.link',
          order: 10,
          href: 'https://qsyjlab.github.io/vite-admin-vue/'
        }
      },
      {
        name: 'Iframe',
        path: 'iframe',
        component: '/system/out/iframe/iframe',
        meta: { title: 'iframe', icon: 'ep.monitor', order: 20, isKeepAlive: true }
      }
    ]
  },
  {
    name: 'Docs',
    path: '/docs',
    component: 'LAYOUT',
    meta: {
      title: '文档',
      icon: 'ep.document',
      order: 80,
      href: 'https://qsyjlab.github.io/vite-admin-vue/'
    }
  },
  {
    name: 'Exception',
    path: '/exception',
    component: 'LAYOUT',
    meta: { title: '异常页面', icon: 'ep.warning-filled', order: 90, ignoreAuth: true },
    children: [
      {
        name: '403',
        path: '403',
        component: '/system/error/error-403',
        meta: { title: '403', icon: 'ep.lock', order: 10, ignoreAuth: true }
      },
      {
        name: '404',
        path: '404',
        component: '/system/error/error-404',
        meta: { title: '404', icon: 'ep.warning', order: 20, ignoreAuth: true }
      }
    ]
  },
  {
    name: 'About',
    path: '/about',
    component: 'LAYOUT',
    meta: {
      title: '关于',
      icon: 'ep.info-filled',
      order: 100,
      hideChildrenInMenu: true,
      ignoreAuth: true
    },
    children: [
      {
        name: 'AboutIndex',
        path: 'about',
        component: '/system/about/about',
        meta: { title: '关于', icon: 'ep.info-filled', ignoreAuth: true }
      }
    ]
  }
]

/** editor —— 精简菜单（无系统管理、外部页面、示例中心） */
const editorBackendMenus = adminBackendMenus.filter(
  item =>
    !['System', 'OutPage', 'Examples', 'Docs', 'Exception', 'About'].includes(item.name as string)
)

/** viewer —— 最小菜单（仅工作台和图表） */
const viewerBackendMenus = adminBackendMenus.filter(item =>
  ['Welcome', 'Charts'].includes(item.name as string)
)

/**
 * 根据用户名获取后端菜单树
 */
export function getBackendMenusByUsername(username: string) {
  switch (username) {
    case 'admin':
      return adminBackendMenus
    case 'editor':
      return editorBackendMenus
    case 'viewer':
      return viewerBackendMenus
    default:
      return []
  }
}

/**
 * 根据用户名+密码查找 mock 用户
 */
export function findMockUser(username: string, password: string): MockUser | undefined {
  return mockUsers.find(u => u.username === username && u.password === password)
}

/**
 * 根据 token 查找 mock 用户
 */
export function findMockUserByToken(token: string): MockUser | undefined {
  return mockUsers.find(u => u.token === token)
}

/**
 * 返回给前端的登录响应数据（剔除密码）
 */
export function toLoginResponse(user: MockUser) {
  const { password: _password, ...userInfo } = user
  return userInfo
}
