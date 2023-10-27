import fs from 'fs/promises'
import path from 'path'
import { outputPath } from '../path.ts'

export async function readFile(path: string) {
  return fs.readFile(path, 'utf8')
}

export async function createFolderIfNotExists(filePath: string) {
  const folderPath = path.dirname(filePath)

  try {
    await fs.access(folderPath) // 尝试访问文件夹
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // 文件夹不存在，创建它
      try {
        await fs.mkdir(folderPath, { recursive: true }) // 使用 recursive 选项创建多级文件夹
        console.log('文件夹已成功创建:', folderPath)
      } catch (mkdirErr: any) {
        console.error('无法创建文件夹:', mkdirErr)
      }
    } else {
      console.error('无法访问文件夹:', err)
    }
  }
}

export async function generate(filePath: string, content: string) {
  try {
    await fs.writeFile(filePath, content)
  } catch (err) {
    console.error('generate error')
    console.error(err)
  }
}

interface GenerateFile {
  path: string
  content: string
}

export async function generateBatch(files: GenerateFile[]) {
  try {
    for await (const iterator of files) {
      const filePath = path.resolve(outputPath, iterator.path)

      await createFolderIfNotExists(filePath)
      await generate(filePath, iterator.content)
    }
  } catch (err) {
    console.error('generate error')
    console.error(err)
  }

  console.error('all file generate successfully')
}
