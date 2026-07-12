export function getCodeEditorLines(value: string) {
  return Array.from({ length: Math.max(1, value.split('\n').length) }, (_, index) => index + 1)
}

export function insertCodeEditorText(
  source: string,
  text: string,
  selectionStart: number,
  selectionEnd: number
) {
  return {
    value: `${source.slice(0, selectionStart)}${text}${source.slice(selectionEnd)}`,
    cursor: selectionStart + text.length
  }
}

export function indentCodeEditorSelection(
  source: string,
  selectionStart: number,
  selectionEnd: number,
  tabSize: number,
  outdent = false
) {
  const lineStart = source.lastIndexOf('\n', Math.max(0, selectionStart - 1)) + 1
  const lineEndIndex = source.indexOf('\n', selectionEnd)
  const lineEnd = lineEndIndex === -1 ? source.length : lineEndIndex
  const block = source.slice(lineStart, lineEnd)
  const indentation = ' '.repeat(Math.max(1, tabSize))
  const lines = block.split('\n')
  const transformed = lines
    .map(line => {
      if (!outdent) return `${indentation}${line}`
      const removable = Math.min(indentation.length, line.match(/^\s*/)?.[0].length ?? 0)
      return line.slice(removable)
    })
    .join('\n')
  const delta = transformed.length - block.length

  return {
    value: `${source.slice(0, lineStart)}${transformed}${source.slice(lineEnd)}`,
    selectionStart: outdent
      ? Math.max(lineStart, selectionStart + delta / lines.length)
      : selectionStart + indentation.length,
    selectionEnd: selectionEnd + delta
  }
}
