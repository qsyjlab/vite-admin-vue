export function getRawType(type: string) {
  if (!type) return ''
  return type.split(':')[1]
}
