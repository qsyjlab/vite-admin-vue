import './css'
import * as components from './el'

import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  Object.keys(components).forEach(item => {
    app.use(components[item as unknown as keyof typeof components])
  })
})
