import { Effect } from './fun/effect'
import { prop } from './fun/prop'
import { curry } from './fun/curry'

const add = curry((val, x) => {
  x.add(val)
  return x
})
const remove = curry((val, x) => {
  x.remove(val)
  return x
})

const $ = (selector) => Effect(() => document.querySelector(selector))

export const application = Effect.of(`html`)
  .chain($)
  .map(prop(`classList`))
  .map(remove(`no-js`))
  .map(add(`js`))
