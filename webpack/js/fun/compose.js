export const compose = (...fns) => fns.reduce((f, g) => (arg1, arg2, ...args) => f(g(arg1, arg2, ...args)))
