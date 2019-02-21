import { compose } from './compose'

export const pipe = (...fns) => compose(...fns.reverse())
