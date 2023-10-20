
import MarkdownIt from 'markdown-it'
import mdContainer from 'markdown-it-container'
import path from 'path'
import fs from 'fs'
import { highlight } from '../utils/highlight'

import { docsRoot } from '../utils/path'

const docRoot = docsRoot

const localMd = MarkdownIt()

export function transformDemo(md){
  md.use(mdContainer, 'demo', {
    validate(params) {

      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        debugger
        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.join(docRoot, 'examples', `${sourceFile}.vue`),
            'utf-8'
          )

        }

        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)



        return `<Demo :demos="demos" source="${encodeURIComponent(
          highlight(source, 'vue')
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(localMd.render(description))}">`
      } else {
        return '</Demo>'
      }
    },
  })
}
