import { add } from './add'

describe(`add`, () => {
  it(`should add numbers`, () => {
    const expected = 4
    const actual = add(2)(2)

    expect(actual).to.equal(expected)
  })

  it(`should add numbers`, () => {
    const expected = 90
    const actual = add(40)(50)

    expect(actual).to.equal(expected)
  })
})
