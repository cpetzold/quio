export function memoizeAsync (fn) {
  let cache = {}
  return (...args) => {
    if (cache[args]) {
      return Promise.resolve(cache[args])
    } else {
      return fn.apply(null, args).then(res => {
        cache[args] = res
        return res
      })
    }
  }
}
