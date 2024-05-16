import { convertUnknownObjectToBlob } from '@/utils/file'
import { renderAsync } from 'docx-preview'

export function docxPreviewRenderAsync(blob: Blob | File | string, container: HTMLElement) {
  return renderAsync(convertUnknownObjectToBlob(blob), container, undefined, {
    className: 'docx',
    inWrapper: true,
    ignoreFonts: false,
    ignoreHeight: false,
    breakPages: true,
    ignoreLastRenderedPageBreak: true,
    experimental: false,
    trimXmlDeclaration: true,
    debug: false
  })
}
