import { path } from './path'
import { prop } from './prop'

describe(`prop`, () => {
  const fred = {
    name: `Fred`,
    age: 23
  }

  it(`returns a function that fetches the appropriate property`, () => {
    const nm = prop(`name`)
    expect(nm).to.be.a(`function`)
    expect(nm(fred)).to.equal(`Fred`)
  })

  it(`shows the same behaviour as path for an undefined object`, () => {
    let propResult, propException, pathResult, pathException
    try {
      propResult = prop(`name`, undefined)
    } catch (e) {
      propException = e
    }

    try {
      pathResult = path([`name`], undefined)
    } catch (e) {
      pathException = e
    }

    expect(propResult).to.equal(pathResult)
    expect(propException).to.deep.equal(pathException)
  })
})
