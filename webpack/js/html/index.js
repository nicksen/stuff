import { effect } from '../fun/effect'

export * from './addClass'
export * from './removeClass'

export const $ = (selector) => effect(() => document.querySelector(selector))
