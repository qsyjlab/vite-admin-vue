import { start, registerMicroApps } from 'qiankun'

/**
 * 启动 qiankun 基座
 */
export function startQiankunApp() {
  start({
    sandbox: {
      strictStyleIsolation: true
    }
  })

  registerMicroApps([
    {
      name: 'react-swc', // app name registered
      entry: '//localhost:5301',
      container: '#react-swc',
      activeRule: '/sub-vite/react-swc'
    }
  ])
}
