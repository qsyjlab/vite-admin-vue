/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map(item => treeMapEach(item, opt))
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn }
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0
  const conversionData = conversion(data) || {}
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion
        })
      )
    }
  }
  return {
    ...conversionData
  }
}

const DEFAULT_KEY_MAP = {
  text: 'name',
  children: 'children',
  id: 'id'
}

/**
 *  扁平tree
 *  tree => list
 */
export function resolveTreeToList(
  treeData: any[],
  keysMap: Partial<typeof DEFAULT_KEY_MAP> = DEFAULT_KEY_MAP
) {
  const { id: kId, children, text } = Object.assign({}, DEFAULT_KEY_MAP, keysMap || {})
  const list: any[] = []
  const obj: Record<string, any> = {}

  traverseData(treeData)

  return { treeMap: obj, list }

  function traverseData(tree: any[], pIds?: any[], pNames?: any[], pLevels?: any[]) {
    const parentIds = pIds || []
    const parentNames = pNames || []
    const levels = pLevels || []

    return tree.map((info, i) => {
      const levs: any[] = levels
      levs.push(i)

      info.$pos = levs.join('_')
      if (!info[kId]) {
        info[kId] = info.$pos
      }

      info.parentIds = parentIds
      info.parentNames = parentNames

      list.push(info)
      obj[info[kId]] = info

      if (info[children] && info[children].length) {
        info.isLeaf = true

        const newParentIds = parentIds.slice()
        const newParentNames = parentNames.slice()
        const strId = String(info[kId])

        newParentIds.push(strId)
        newParentNames.push(info[text])

        info.childrenIds = traverseData(info[children], newParentIds, newParentNames, levs)
      }

      info.isLeaf = false
      return String(info[kId])
    })
  }
}
