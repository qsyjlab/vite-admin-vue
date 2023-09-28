import { defineAppPlugin } from '@/utils'
import * as components from './index'

// import componentsV2 from './components'

export default defineAppPlugin(app => {
  Object.keys(components).forEach(item => {
    const key = item as keyof typeof components

    app.component(components[key].name, components[key])
  })
  // componentsV2.forEach(c => {
  //   app.use(c)
  // })
})
