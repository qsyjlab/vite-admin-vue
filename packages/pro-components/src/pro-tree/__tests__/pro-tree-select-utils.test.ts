import { describe, expect, it } from 'vitest'
import { mergeProTreeSelectCacheData } from '../pro-tree-select-utils'

describe('pro-tree-select-utils', () => {
  it('merges path cache data by node key while preserving source order', () => {
    expect(
      mergeProTreeSelectCacheData(
        [
          [{ id: 1, label: 'Root' }],
          [
            { id: 1, label: 'Root duplicate' },
            { id: 2, label: 'Child' }
          ]
        ],
        'id'
      )
    ).toEqual([
      { id: 1, label: 'Root' },
      { id: 2, label: 'Child' }
    ])
  })

  it('supports nested node key paths', () => {
    expect(
      mergeProTreeSelectCacheData(
        [
          [{ meta: { key: 'root' }, label: 'Root' }],
          [{ meta: { key: 'root' }, label: 'Duplicate' }]
        ],
        'meta.key'
      )
    ).toHaveLength(1)
  })
})
