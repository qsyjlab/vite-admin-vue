export type ValueType = ValueTypeVal | (() => ValueTypeVal)

export type ValueTypeVal = 'text' | 'enum' | { type?: string; status?: string }

export type ValueEnum = ValueEnumRecord | ((rowData: any) => ValueEnumRecord | ValueEnumMap)

export type ValueEnumMap = Map<string | number | boolean, ValueEnumRecord>
export type ValueEnumRecord = Record<string, ValueEnumValue>

export type ValueEnumValue = {
  text?: string
  color?: string
}
