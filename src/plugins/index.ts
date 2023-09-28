import setupElementPlus from './elementPlus'
import setUpDayJs from './dayJs'
import setupPinia from './pinia'
import registerGlobalComponents from './components'

import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  // pinia
  setupPinia(app)
  // dayjs
  setUpDayJs(app)
  // elementPlus
  setupElementPlus(app)
  // custom global components
  registerGlobalComponents(app)

  // vite-plugin-svg-icons 虚拟路径
  import('./vite-plugin-svg-icons')
  // 进度条
  import('./nprogress')
})
