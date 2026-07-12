import { describe, expect, it } from 'vitest'
import {
  getProListItemValues,
  getProListRowKey,
  normalizeProListResponse,
  paginateProListData
} from '../pro-list-utils'

interface Project {
  id: number
  owner: { name: string }
  summary: string
}

const projects: Project[] = [
  { id: 1, owner: { name: 'Ada' }, summary: 'A' },
  { id: 2, owner: { name: 'Linus' }, summary: 'B' },
  { id: 3, owner: { name: 'Grace' }, summary: 'C' }
]

describe('pro-list utils', () => {
  it('reads row keys and item metadata from paths or getters', () => {
    expect(getProListRowKey(projects[0], 'id')).toBe(1)
    expect(
      getProListItemValues(projects[0], 0, {
        title: 'owner.name',
        description: record => record.summary
      })
    ).toMatchObject({ title: 'Ada', description: 'A' })
  })

  it('paginates local records and normalizes responses', () => {
    expect(paginateProListData(projects, { current: 2, pageSize: 2 })).toEqual([projects[2]])
    expect(normalizeProListResponse({ data: projects, total: Number.NaN })).toEqual({
      data: projects,
      total: 0,
      success: undefined
    })
  })
})
