import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vite-admin-vue",
  description: " ",
  markdown: {
  
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '指南', link: '/guide/doc' }
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '简介', link: '/guide/doc' },
          { text: '使用', link: '/guide/use' },
          { text: '目录说明', link: '/guide/contents' }
        ]
      },
      {
        text: '路由',
        items: [
          { text: '配置', link: '/route/setting' },
          { text: '菜单', link: '/route/menu' },
          { text: '路由刷新', link: '/route/reload' },
          { text: '多标签页', link: '/route/tab' }, 
        ]
      },
      {
        text: '权限',
        link: '/permission/index.md'
        // items: [
        //   { text: '配置', link: '/route/setting' },
        //   { text: '菜单', link: '/route/menu' },
        //   { text: '路由刷新', link: '/route/reload' },
        //   { text: '多标签页', link: '/route/tab' }, 
        // ]
      },
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
