import { defineAppPlugin } from '@/utils'
import * as exportsComponents from './exports'

export default defineAppPlugin(app => {
  Object.keys(exportsComponents).forEach(name => {
    const key = name as keyof typeof exportsComponents
    const component = exportsComponents[key]

    app.use(component)
  })
})
