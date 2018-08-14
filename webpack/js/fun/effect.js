export const effect = (f) => ({
  map (g) {
    return effect((x) => g(f(x)))
  },

  run (x) {
    return f(x)
  },

  join (x) {
    return f(x)
  },

  chain (g) {
    return effect(f).map(g).join()
  }
})

effect.of = (val) => effect(() => val)
