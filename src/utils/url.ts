export function getUrlParam(name: string, search = window.location.search) {
  return new URLSearchParams(search).get(name)
}
