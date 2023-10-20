import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { docsRoot } from '../utils/path'


import type { Plugin } from 'vite'


const docRoot = docsRoot
let compPaths: string[]

export function MarkdownTransform(): Plugin {
  return {
    name: 'element-plus-md-transform',

    enforce: 'pre',

    async buildStart() {
      const pattern = `/component`

      compPaths = await glob(pattern, {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      })
    },

    async transform(code, id) {
      if (!id.endsWith('.md')) return

      const componentId = path.basename(id, '.md')
      const append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.globEager('../examples/${componentId}/*.vue')`,
          `console.log("demos", demos);`
        ],
      }


const combineScriptSetup = (codes: string[]) =>
`\n<script setup>
${codes.join('\n')}
</script>
`



      code += "\n" + combineScriptSetup(append.scriptSetups)

      return code

    },
  }
}


