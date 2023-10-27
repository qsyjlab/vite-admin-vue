import path from 'path'
import {
  createFolderIfNotExists,
  generate,
  readFile,
  projectRootPath,
  outputPath,
  generateBatch
} from '../utils/index.ts'

async function generateAndWriteFile() {
  const content = await readFile(path.resolve(projectRootPath, 'template/pro-form.template'))

  await generateBatch([
    {
      path: './pro-table-gen/pro-table.vue',
      content
    },
    {
      path: './pro-table-gen/config/index.ts',
      content: `
      type ColumnData  = any

      const columns: ProTableColumns<ColumnData> = [
        {
          title: '名称',
          key: 'name',
          tip: '测试tip提示',
          fixed: 'left',
          width: 200
        },
        {
          title: '年龄',
          key: 'age',
          width: 200,
          fixed: 'left',
          children: [
            {
              title: '年龄2',
              key: 'age-c',
              children: []
            },
            {
              title: '年龄3',
              key: 'age-c2',
              children: []
            }
          ]
        },
        {
          title: '地址',
          key: 'address',
          width: 200
        },
        {
          title: '邮箱',
          key: 'email',
          fixed: 'left',
          width: 200
        },
        {
          title: '年份',
          key: 'year',
          width: 200
        },
        {
          title: '进度条',
          key: 'progress',
          width: 200,
          valueType: () => {
            return { type: 'progress' }
          }
        },
        {
          title: '函数式返回 enum',
          key: 'fnE',
          valueType: 'enum',
          width: 200,
          valueEnum: () => {
            return {
              all: { text: '全部', color: 'blue' },
              open: {
                text: '未解决',
                color: 'green'
              },
              closed: {
                text: '已解决',
                color: 'red'
              },
              processing: {
                text: '解决中',
                color: 'blue'
              }
            }
          }
        },
        {
          title: '状态',
          key: 'status',
          valueType: 'enum',
          width: 200,

          valueEnum: {
            all: { text: '全部', color: 'blue' },
            open: {
              text: '未解决',
              color: 'green'
            },
            closed: {
              text: '已解决',
              color: 'red'
            },
            processing: {
              text: '解决中',
              color: 'blue'
            }
          }
        },
        {
          title: '地址1',
          key: 'address1',
          width: 200
        },
        {
          title: '地址2',
          key: 'address2',
          width: 200
        },
        {
          title: '操作',
          key: 'operation',
          width: 200,
          fixed: 'right'
        }
      ]
      `
    }
  ])
}

generateAndWriteFile()
