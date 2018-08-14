import { effect } from './effect'

describe(`effect`, () => {
  const increment = (x) => x + 1
  const double = (x) => x * 2
  const cube = (x) => x ** 3

  it(`should wrap input function`, () => {
    let ran = false
    const input = () => {
      ran = true
    }

    effect(input)

    expect(ran).to.be.false
  })

  it(`should be able to map`, () => {
    effect(() => 2).map(double)
  })

  it(`should be able to run effects`, () => {
    const expected = 4
    const actual = effect(() => 2).map(double).run()

    expect(actual).to.equal(expected)
  })

  it(`should be able to run effects`, () => {
    const expected = 6
    const actual = effect(() => 3).map(double).run()

    expect(actual).to.equal(expected)
  })

  it(`should be able to run effects with arguments`, () => {
    const expected = 4
    const actual = effect(increment).map(double).run(1)

    expect(actual).to.equal(expected)
  })

  it(`should be able to wrap constants`, () => {
    const expected = 2
    const actual = effect.of(2).run()

    expect(actual).to.equal(expected)
  })

  it(`should follow composition rule`, () => {
    const incDoubleCube = (x) => cube(double(increment(x)))
    const e = effect(() => 0)
    const composed = e.map(incDoubleCube).run()
    const mapped = e.map(increment).map(double).map(cube).run()

    expect(mapped).to.equal(composed)
  })

  it(`should be able to join nested effects`, () => {
    const expected = 4
    const actual = effect.of(2).map((x) => effect.of(double(x))).join().run()

    expect(actual).to.equal(expected)
  })

  it(`should be able to map and join in one step`, () => {
    const expected = 4
    const actual = effect.of(2).chain((x) => effect.of(double(x))).run()

    expect(actual).to.equal(expected)
  })
})
