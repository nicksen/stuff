import { effect } from './fun/effect'
import { $, addClass, removeClass } from './html'

const root = effect.of(`html`)
  .chain($)

const remove = root.ap(removeClass).run(`no-js`)
const add = root.ap(addClass).run(`js`)

export const application = effect.all([remove, add]).run()
