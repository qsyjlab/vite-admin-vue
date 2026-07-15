export function mergeProTreeSelectCacheData<TNode extends object>(
  sources: TNode[][],
  nodeKey: string
): TNode[] {
  const result: TNode[] = []
  const keys = new Set<unknown>()

  for (const source of sources) {
    for (const node of source) {
      const key = getNodeValue(node, nodeKey)
      if (key !== undefined && keys.has(key)) continue
      if (key !== undefined) keys.add(key)
      result.push(node)
    }
  }

  return result
}

function getNodeValue(node: object, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, node)
}
