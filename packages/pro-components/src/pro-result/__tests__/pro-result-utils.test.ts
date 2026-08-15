import { describe, expect, it } from 'vitest'
import { getProResultDefaultContent } from '../pro-result-utils'

describe('pro-result-utils', () => {
  it.each([
    ['success', '操作成功'],
    ['error', '操作失败'],
    ['403', '403'],
    ['404', '404'],
    ['500', '500']
  ] as const)('resolves default content for %s', (status, title) => {
    expect(getProResultDefaultContent(status)).toEqual(
      expect.objectContaining({ title, subTitle: expect.any(String) })
    )
  })
})
