import { compose } from './compose'

describe(`compose`, () => {
  it(`is a variadic function`, () => {
    expect(compose.length).to.equal(0)
  })

  it(`performs right-to-left function composition`, () => {
    const fun1 = (val) => `1${val}`
    const fun2 = (val) => `2${val}`
    const fun3 = (val) => `3${val}`

    const f = compose(fun1, fun2, fun3)

    expect(f.length).to.equal(2)
    expect(f(`4`)).to.equal(`1234`)
  })
})
