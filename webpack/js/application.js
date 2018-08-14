import {
  Effect
} from './fun/effect'

const addClass = (node) => (cls) => {
  node.classList.add(cls)
  return node
}

const removeClass = (node) => (cls) => {
  node.classList.remove(cls)
  return node
}

const $ = (selector) => Effect(() => document.querySelector(selector))

export const application = Effect.pipe(
  Effect.of(`html`),
  Effect($).join(),
  Effect(removeClass(`no-js`)),
  Effect(addClass(`js`))
)
