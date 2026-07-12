import { describe, expect, it } from 'vitest'
import {
  getCodeEditorLines,
  indentCodeEditorSelection,
  insertCodeEditorText
} from '../pro-code-editor-utils'

describe('pro-code-editor-utils', () => {
  it('calculates visible line numbers', () => {
    expect(getCodeEditorLines('')).toEqual([1])
    expect(getCodeEditorLines('a\nb\n')).toEqual([1, 2, 3])
  })

  it('inserts text at the current selection', () => {
    expect(insertCodeEditorText('hello world', 'JSON', 6, 11)).toEqual({
      value: 'hello JSON',
      cursor: 10
    })
  })

  it('indents and outdents selected lines', () => {
    const indented = indentCodeEditorSelection('a\nb', 0, 3, 2)
    expect(indented.value).toBe('  a\n  b')
    expect(indentCodeEditorSelection(indented.value, 0, indented.value.length, 2, true).value).toBe(
      'a\nb'
    )
  })
})
