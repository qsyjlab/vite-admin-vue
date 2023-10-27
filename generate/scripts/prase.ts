import { projectRootPath, repoRootPath } from '../utils/path.ts'
import { readFile } from '../utils/node/index.ts'

import * as babelParser from '@babel/parser'
import babelTraverse from '@babel/traverse'
import babelGenerate from '@babel/generator'
import babelTypes from '@babel/types'

import path from 'path'

const targetPath = path.resolve(repoRootPath, 'src', 'router', 'routes', 'modules', 'charts.ts')

console.log('targetPath', targetPath)

async function getStr() {
  const codeString = await readFile(targetPath)

  // 将代码解析成 ast
  const ast = babelParser.parse(codeString, {
    sourceType: 'module'
  })

  let resultObject: any = null

  let exportedContent: any = null

  babelTraverse.default(ast, {
    CallExpression(path) {
      if (exportedContent && !resultObject) {
        // const callee = path.get('callee')
        // const argumentss = path.get('arguments')

        // console.log('argumentss', argumentss[0])

        // console.log('Callee:', callee.toString())
        // console.log('Arguments:', argumentss.toString())
        const newParamValue = babelTypes.numericLiteral(42)

        // console.log('newParamValue', newParamValue)
        debugger

        // 获取原始参数
        // const existingArguments = path.get('arguments')[0]

        // 创建一个新的数组节点
        const newArrayNode = babelTypes.arrayExpression([
          babelTypes.numericLiteral(1),
          babelTypes.numericLiteral(23),
          babelTypes.numericLiteral(4)
        ])

        const arg = path.get('arguments')[0]
        arg.replaceWith(newArrayNode)
        // 替换原始参数为新的数组
      }

      debugger
    },

    // 这里提取 export default 并判定是否为数组或者对象类型
    ExportDefaultDeclaration(path) {
      const declaration = path.get('declaration')
      if (declaration.isFunctionExpression() || declaration.isArrowFunctionExpression()) {
        debugger
        // 处理函数，获取函数参数
        const params = declaration.get('params').map(param => param.node.name)
        // console.log('Function Params:', params)
        resultObject = params
      } else if (declaration.isArrayExpression() || declaration.isObjectExpression()) {
        resultObject = declaration
        // 处理数组或对象
        // console.log('Array or Object:', declaration.toString())
      } else {
        // 这里是无法解析的内容
        // 保存内容进入下一层判定
        exportedContent = declaration
      }
    }
  })

  // console.log('exportedContent', exportedContent)
  debugger

  console.log('resultObject', typeof resultObject)

  // 生成修改后的代码字符串
  const modifiedCode = babelGenerate.default(ast).code

  console.log('modifiedCode', modifiedCode)

  debugger

  // console.log('codeString', codeString)

  // const exportDefaultMatch = codeString.match(/export default (\{[\s\S]*?\});/)

  // console.log('exportDefaultMatch', exportDefaultMatch)
}

getStr()
