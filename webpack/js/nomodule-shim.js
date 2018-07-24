/**
 * https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
 *
 * Safari 10.1 supports modules, but does not support the `nomodule` attribute - it will load <script nomodule> anyway.
 * This snippet solve this problem, but only for script tags that load external code, e.g.:
 * <script nomodule src="nomodule.js"></script>
 *
 * Again: this will **not** prevent inline script, e.g.: <script nomodule>alert('no modules');</script>.
 *
 * This workaround is possible because Safari supports the non-standard 'beforeload' event. This allows us to trap the
 * module and nomodule load.
 *
 * Note also that `nomodule` is supported in later versions of Safari - it's just 10.1 that omits this attribute.
 */

const check = document.createElement(`script`)
if (!(`noModule` in check) && `onbeforeload` in check) {
  let support = false
  document.addEventListener(`beforeload`, (e) => {
    if (e.target === check) {
      support = true
    } else if (!e.target.hasAttribute(`nomodule`) || !support) {
      return
    }
    e.preventDefault()
  }, true)

  check.type = `module`
  check.src = `.`
  document.head.appendChild(check)
  check.remove()
}
