import { resolve } from 'path'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function configSvgIconsPlugin({ isBuild }: { isBuild: boolean }) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), 'src/assets/svg-icons')],
    svgoOptions: isBuild
  })
  return svgIconsPlugin
}
