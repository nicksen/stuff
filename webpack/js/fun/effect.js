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
  },

  ap (ef) {
    return ef.map((g) => g(f()))
  }
})

effect.of = (val) => effect(() => val)

effect.all = (...effects) => effect((x) => {
  return effects.map((e) => e.run(x))
})
