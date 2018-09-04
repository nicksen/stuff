import { path } from './path'

describe(`path`, () => {
  const deepObject = {
    a: { b: { c: `c` } },
    falseVal: false,
    nullVal: null,
    undefinedVal: undefined,
    arrayVal: [`arr`]
  }

  it(`takes a path and an object and returns the value at the path or undefined`, () => {
    const obj = {
      a: {
        b: { c: 100, d: 200 },
        e: { f: [100, 101, 102], g: `G` },
        h: `H`
      },
      i: `I`,
      j: [`J`]
    }

    expect(path([`a`, `b`, `c`], obj)).to.equal(100)
    expect(path([], obj)).to.deep.equal(obj)
    expect(path([`a`, `e`, `f`, 1], obj)).to.equal(101)
    expect(path([`j`, 0], obj)).to.equal(`J`)
    expect(path([`j`, 1], obj)).to.be.undefined
  })

  it(`gets a deep property's value from objects`, () => {
    expect(path([`a`, `b`, `c`], deepObject)).to.equal(`c`)
    expect(path([`a`], deepObject)).to.equal(deepObject.a)
  })

  it(`returns undefined for items not found`, () => {
    expect(path([`a`, `b`, `foo`], deepObject)).to.be.undefined
    expect(path([`bar`], deepObject)).to.be.undefined
    expect(path([`a`, `b`], { a: null })).to.be.undefined
  })

  it(`works with falsy items`, () => {
    expect(path([`toString`], false)).to.equal(Boolean.prototype.toString)
  })
})
