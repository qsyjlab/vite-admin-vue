export type ValueType = ValueTypeVal | ((row: any) => ValueTypeVal)

export type ValueTypeVal = BaseValueType | ValueTypeObject

export type BaseValueType = 'text' | 'enum' | 'indexBorder' | 'progress' | 'image' | string

export type ValueTypeObject = { type: BaseValueType; status?: string; color?: string } & {
  [key: string]: any
}

export type ValueEnum = ValueEnumRecord | ((rowData: any) => ValueEnumRecord | ValueEnumMap)

export type ValueEnumMap = Map<string | number | boolean, ValueEnumRecord>
export type ValueEnumRecord = Record<string, ValueEnumValue>

export type ValueEnumValue = {
  text?: string
  color?: string
}
