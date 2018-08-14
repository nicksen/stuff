import { tl } from './tl'

describe(`tl`, () => {
  it(`should fetch all but first elements from array`, () => {
    const expected = [2, 3]
    const actual = tl([1, 2, 3])

    expect(actual).to.deep.equal(expected)
  })
})
