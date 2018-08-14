import { effect } from '../fun/effect'

export const removeClass = effect((node) => (cls) => {
  node.classList.remove(cls)
  return node
})
