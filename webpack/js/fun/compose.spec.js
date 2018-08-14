import { compose } from './compose'

describe(`compose`, () => {
  const multiplyTwo = (x) => x * 2
  const addOne = (x) => x + 1

  it(`should map function over value`, () => {
    const expected = 4
    const actual = compose(multiplyTwo)(2)

    expect(actual).to.equal(expected)
  })

  it(`should map functions over value`, () => {
    const expected = 5
    const actual = compose(addOne, multiplyTwo)(2)

    expect(actual).to.equal(expected)
  })

  it(`should map all functions over value`, () => {
    const expected = 6
    const actual = compose(multiplyTwo, addOne, (x) => x.a)({
      a: 2
    })

    expect(actual).to.equal(expected)
  })
})
