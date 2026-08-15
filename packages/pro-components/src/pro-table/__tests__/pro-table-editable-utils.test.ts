import { describe, expect, it } from 'vitest'
import { validateProTableEditableRow } from '../pro-table-editable-utils'
import type { ProTableColumns } from '../pro-table'

interface Row {
  id: number
  profile: {
    name: string
  }
}

const columns: ProTableColumns<Row> = [
  {
    key: 'name-editor',
    dataIndex: 'profile.name',
    editable: true,
    rowComponent: {
      el: 'el-input',
      rules: [
        { required: true, message: '请输入名称' },
        {
          validator: value =>
            String(value).length >= 2 ? true : Promise.resolve('名称至少两个字符')
        }
      ]
    }
  }
]

describe('pro-table editable validation', () => {
  it('validates nested editable values', async () => {
    await expect(
      validateProTableEditableRow({ id: 1, profile: { name: '' } }, columns)
    ).resolves.toEqual({
      'name-editor': [{ message: '请输入名称' }, { message: '名称至少两个字符' }]
    })
  })

  it('supports Element Plus validator callbacks', async () => {
    const callbackColumns: ProTableColumns<Row> = [
      {
        key: 'name',
        dataIndex: 'profile.name',
        editable: true,
        rowComponent: {
          el: 'el-input',
          rules: [{ validator: (_value, _row, callback) => callback(new Error('名称不可用')) }]
        }
      }
    ]

    await expect(
      validateProTableEditableRow({ id: 1, profile: { name: '测试' } }, callbackColumns)
    ).resolves.toEqual({ name: [{ message: '名称不可用' }] })
  })

  it('waits for asynchronous Element Plus validator callbacks', async () => {
    const callbackColumns: ProTableColumns<Row> = [
      {
        key: 'name',
        dataIndex: 'profile.name',
        editable: true,
        rowComponent: {
          el: 'el-input',
          rules: [
            {
              validator: (_value, _row, callback) => {
                setTimeout(() => callback('异步校验失败'), 0)
              }
            }
          ]
        }
      }
    ]

    await expect(
      validateProTableEditableRow({ id: 1, profile: { name: '测试' } }, callbackColumns)
    ).resolves.toEqual({ name: [{ message: '异步校验失败' }] })
  })
})
