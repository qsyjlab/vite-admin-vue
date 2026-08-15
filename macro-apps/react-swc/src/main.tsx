import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import './index.css'

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from './router.tsx'

let root: Root | null = null

function render(props: { container?: HTMLElement }) {
  const { container } = props
  const dom = container ? container.querySelector('#root') : document.getElementById('root')

  if (!dom) return

  root = createRoot(dom)
  function AppRoutes() {
    // 🔑 使用 useRoutes 渲染路由
    return useRoutes(routes)
  }

  root.render(
    <StrictMode>
      <BrowserRouter basename={'/sub-vite/react-swc'}>
        <AppRoutes />
      </BrowserRouter>
    </StrictMode>
  )
}

renderWithQiankun({
  bootstrap() {
    console.log('React app bootstraped')
  },
  mount(props) {
    console.log('React app mount', props)
    render(props)
  },
  update(props) {
    console.log('React app update', props)
  },
  unmount(props) {
    console.log('React app unmount', props)
    root?.unmount()
    const { container } = props
    const dom = container ? container.querySelector('#root') : document.getElementById('root')
    if (dom) {
      dom.innerHTML = ''
    }

    root = null
  }
})

// 独立运行模式（本地调试时不走 qiankun）
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
