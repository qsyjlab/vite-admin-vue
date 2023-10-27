import { projectRootPath, repoRootPath } from '../utils/path.ts'
import { readFile } from '../utils/node/index.ts'

import babelParser from '@babel/parser'
import babelTraverse from '@babel/traverse'
// import * as babelGenerate from '@babel/generator'

import path from 'path'

const targetPath = path.resolve(repoRootPath, 'src', 'router', 'routes', 'modules', 'charts.ts')

console.log('targetPath', targetPath)

async function getStr() {
  const codeString = await readFile(targetPath)

  const ast = babelParser.parse(codeString, {
    sourceType: 'module'
  })

  const exportedContent = null

  babelTraverse(ast, {
    ExportDefaultDeclaration(path: any) {
      // 获取 export default 块中的内容
      // exportedContent = babelGenerate(path.node.declaration).code
    }
  })

  console.log('parsedCodeString', exportedContent)
  debugger

  // console.log('codeString', codeString)

  // const exportDefaultMatch = codeString.match(/export default (\{[\s\S]*?\});/)

  // console.log('exportDefaultMatch', exportDefaultMatch)
}

getStr()
