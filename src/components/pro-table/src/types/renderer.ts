export type ValueType = ValueTypeVal | (() => ValueTypeVal)

export type ValueTypeVal = BaseValueType | { type?: BaseValueType; status?: string; color?: string }

export type BaseValueType = 'text' | 'enum' | 'indexBorder' | 'progress' | 'image'

export type ValueEnum = ValueEnumRecord | ((rowData: any) => ValueEnumRecord | ValueEnumMap)

export type ValueEnumMap = Map<string | number | boolean, ValueEnumRecord>
export type ValueEnumRecord = Record<string, ValueEnumValue>

export type ValueEnumValue = {
  text?: string
  color?: string
}
