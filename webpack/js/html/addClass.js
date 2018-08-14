import { effect } from '../fun/effect'

export const addClass = effect((node) => (cls) => {
  node.classList.add(cls)
  return node
})
