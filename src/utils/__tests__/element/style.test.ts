import { parseStringStyle } from '../../element/style'
import { describe, it, expect } from 'vitest'

describe('style', () => {
  it('parseStringStyle should work', () => {
    expect(parseStringStyle('border: 1px solid transparent;color:red;')).toEqual({
      border: '1px solid transparent',
      color: 'red'
    })
    expect(
      parseStringStyle('border: 1px solid transparent;color:red;background-color:red')
    ).toEqual({
      border: '1px solid transparent',
      color: 'red',
      'background-color': 'red'
    })
    expect(parseStringStyle('border: 1px solid transparent;color:red;backgroundColor:red')).toEqual(
      {
        border: '1px solid transparent',
        color: 'red',
        backgroundColor: 'red'
      }
    )

    expect(parseStringStyle('')).toEqual({})
    expect(parseStringStyle('no style')).toEqual({})
  })
})
