export type ProPathSegment = string | number

export type ProPath = ProPathSegment | readonly ProPathSegment[]

export type ProLiteralUnion<T extends string> = T | (string & Record<never, never>)

type ProBuiltin = Date | RegExp | ((...args: never[]) => unknown)
type ProStringKey<T> = Extract<keyof T, string | number>
type ProDepthMap = {
  1: [unknown]
  2: [unknown, unknown]
  3: [unknown, unknown, unknown]
  4: [unknown, unknown, unknown, unknown]
}

type ProJoinPath<TKey extends string | number, TPath> = TPath extends string | number
  ? `${TKey}.${TPath}`
  : never

type ProDataPathInternal<T, TDepth extends unknown[]> = TDepth extends [unknown, ...infer TRest]
  ? T extends ProBuiltin | readonly unknown[]
    ? never
    : T extends object
      ? {
          [TKey in ProStringKey<T>]:
            | `${TKey}`
            | (NonNullable<T[TKey]> extends object
                ? ProJoinPath<TKey, ProDataPathInternal<NonNullable<T[TKey]>, TRest>>
                : never)
        }[ProStringKey<T>]
      : never
  : never

/** Dot notation paths are intentionally capped to keep editor and vue-tsc performance stable. */
export type ProDataPath<T, TDepth extends 1 | 2 | 3 | 4 = 4> = ProDataPathInternal<
  T,
  ProDepthMap[TDepth]
>

export type ProDataIndex<T> =
  | ProLiteralUnion<Extract<ProDataPath<T>, string>>
  | readonly ProPathSegment[]

export function normalizeProPath(path: ProPath): ProPathSegment[] {
  if (typeof path !== 'string' && typeof path !== 'number') return [...path]
  if (typeof path === 'number') return [path]
  return path.split('.').filter(Boolean)
}

export function getProPathValue<TValue = unknown>(
  source: unknown,
  path: ProPath
): TValue | undefined {
  return normalizeProPath(path).reduce<unknown>((value, segment) => {
    if (value === null || value === undefined || typeof value !== 'object') return undefined
    return Reflect.get(value, segment)
  }, source) as TValue | undefined
}
