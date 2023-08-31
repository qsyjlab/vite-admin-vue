import setupElementPlus from './elementPlus'
import setUpDayJs from './dayJs'
import setupPinia from './pinia'
import setupProgress from './nprogress'
import setupWindicss from './windicss'

import registerGlobalComponents from '@/components/register'
import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  // 进度条
  setupProgress(app)
  // pinia
  setupPinia(app)
  // dayjs
  setUpDayJs(app)
  // elementPlus
  setupElementPlus(app)
  // custom global components
  registerGlobalComponents(app)

  // windicss
  setupWindicss(app)
})
