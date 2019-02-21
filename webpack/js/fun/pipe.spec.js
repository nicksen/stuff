import { pipe } from './pipe'

describe(`pipe`, () => {
  it(`is a variadic function`, () => {
    expect(pipe.length).to.equal(0)
  })

  it(`performs left-to-right function composition`, () => {
    const fun1 = (val) => `1${val}`
    const fun2 = (val) => `2${val}`
    const fun3 = (val) => `3${val}`

    const f = pipe(fun1, fun2, fun3)

    expect(f.length).to.equal(2)
    expect(f(`4`)).to.equal(`3214`)
  })
})
