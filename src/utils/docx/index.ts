import { Document, Packer } from 'docx'
import { richTextToParagraph } from './html'
import { downloadFile } from '../es'

export function pureRichTextExportDocx(richText: string | string[], filename?: string) {
  docxPackerToBlob(converRichTextToDocument(richText)).then(blob => {
    const url = URL.createObjectURL(blob)
    downloadFile(url, filename ? `${filename}.docx` : undefined)
  })
}

function docxPackerToBlob(doc: Document) {
  return Packer.toBlob(doc)
}

export function pureRictTextToBlob(richText: string | string[]) {
  return docxPackerToBlob(converRichTextToDocument(richText))
}

export function converRichTextToDocument(richText: string | string[]) {
  const doc = new Document({
    features: {
      updateFields: true
    },

    sections: [
      {
        properties: {
          page: {
            // 这里因为配置已经是 mm => twip 单位所以不用在转换了
            margin: {
              top: 1814,
              bottom: 1814,
              left: 1417,
              right: 1417
            },
            size: {
              width: 11906,
              height: 16838
            }
          }
        },
        children: richTextToParagraph(richText)
      }
    ]
  })

  return doc
}
