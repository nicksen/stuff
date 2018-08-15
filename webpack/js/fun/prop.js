import { curry } from './curry'
import { path } from './path'

export const prop = curry((p, obj) => path([p], obj))
