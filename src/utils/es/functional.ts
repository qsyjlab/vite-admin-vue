export function pipe(...fns: ((...args: any[]) => any[])[]) {
  return function piped(result) {
    for (let i = 0; i < fns.length; i++) {
      result = fns[i](result)
    }
    return result
  }
}
