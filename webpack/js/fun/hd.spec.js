import { hd } from './hd'

describe(`hd`, () => {
  it(`fetches first element of array`, () => {
    const expected = 1
    const actual = hd([1])

    expect(actual).to.equal(expected)
  })
})
