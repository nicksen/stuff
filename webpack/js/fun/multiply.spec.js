import { multiply } from './multiply'

describe(`multiply`, () => {
  it(`should multiply numbers`, () => {
    const expected = 16
    const actual = multiply(4)(4)

    expect(actual).to.equal(expected)
  })

  it(`should multiply numbers`, () => {
    const expected = 90
    const actual = multiply(45)(2)

    expect(actual).to.equal(expected)
  })
})
