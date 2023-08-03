// columnsState={{
//   persistenceKey: 'pro-table-singe-demos',
//   persistenceType: 'localStorage',
//   onChange(value) {
//     console.log('value: ', value);
//   },
// }}

export type ColumnsMap = Record<string, any>

export interface ColumnsState {
  persistenceKey?: string
  persistenceType?: 'localStorage' | 'sessionStorage'
  value?: ColumnsMap
  change?: (map: ColumnsMap) => void
}
