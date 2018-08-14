export function Effect (f) {
  return {
    map (g) {
      return Effect((x) => g(f(x)))
    },

    run (x) {
      return f(x)
    },

    join (x) {
      return f(x)
    },

    chain (g) {
      return Effect(f).map(g).join()
    },

    ap (ef) {
      // If someone calls `ap`, we assume `ef` has a function inside it (rather than a value).
      // We'll use `map` to go inside off, and access that function (we'll call it 'g')
      // Once we've got `g`, we apply the value inside off `f()` to it
      return ef.map((g) => g(f()))
    }
  }
}

Effect.of = function of (val) {
  return Effect(() => val)
}

Effect.all = function all (effects) {
  return Effect(() => effects.map((ef) => ef.run()))
}

Effect.pipe = function pipe (...effects) {
  return effects.reduce((acc, effect) => acc.ap(effect))
}
