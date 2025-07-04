import { Paragraph, TextRun, type ParagraphChild } from 'docx'
import { cssStylesToAttrs, getInlineStyles, tagsToAttrs } from './style'

export function richTextToParagraph(richText: string | string[]) {
  const paragraphNodes: Paragraph[] = []

  const richTextArr = Array.isArray(richText) ? richText : [richText]

  richTextArr.forEach(rich => {
    paragraphNodes.push(
      new Paragraph({
        pageBreakBefore: true
      })
    )
    paragraphNodes.push(...convertRichTextToParagraphNodes(rich))
  })
  return paragraphNodes
}

/**
 * @see https://docx.js.org/
 */
function convertRichTextToParagraphNodes(richText: string) {
  const container = document.createElement('div')
  container.innerHTML = richText
  const parsedHtml = new DOMParser().parseFromString(richText, 'text/html')

  const paragraphNodes: Paragraph[] = []

  parsedHtml.body.querySelectorAll('p,h1,h2,h3,h4,h6').forEach(element => {
    const paragraphChildrenNodes: ParagraphChild[] = []

    const rootStyles = cssStylesToAttrs(getInlineStyles(element))

    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        paragraphChildrenNodes.push(
          new TextRun({
            text: node.textContent || '',
            ...customMerge(cssStylesToAttrs(getInlineStyles(node)), rootStyles)
          })
        )
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elementNode = node as any

        const attrsTags = ['strong', 'em', 'i']
        const tagNames = Array.from(elementNode.querySelectorAll(attrsTags.join(','))).map(
          (node: any) => node.tagName.toLowerCase()
        )
        const tagAttrs = tagsToAttrs(tagNames)

        const deepAttrs = customMerge(
          customMerge(cssStylesToAttrs(getInlineStyles(elementNode)), rootStyles),
          tagAttrs
        )

        paragraphChildrenNodes.push(
          new TextRun({
            text: elementNode.textContent,
            ...deepAttrs
          })
        )
      }
    })
    const paragraph = new Paragraph({
      children: paragraphChildrenNodes,
      spacing: {
        line: rootStyles.lineSpacing,
        lineRule: 'exact'
      },
      alignment: rootStyles.alignment,
      indent: rootStyles.indent
    })
    paragraphNodes.push(paragraph)
  })

  return paragraphNodes
}

// 自定义合并函数，忽略obj2中的undefined值
function customMerge(target, source) {
  Object.keys(source).forEach(key => {
    if (source[key] !== undefined) {
      target[key] = source[key]
    }
  })
  return target
}

export function recursiveHtmlNodes(childrenNodes: ChildNode[], paragraphNodes: Paragraph[] = []) {
  childrenNodes.forEach(node => {
    const paragraphNode = new Paragraph({
      children: [
        new TextRun({
          text: node.textContent || '',
          ...cssStylesToAttrs(getInlineStyles(node))
        })
      ]
    })

    paragraphNodes.push(paragraphNode)

    if (node.childNodes) {
      recursiveHtmlNodes(Array.from(node.childNodes), paragraphNodes)
    }
  })
  return paragraphNodes
}
