# Watermark 水印组件

生成水印层

## Type

```ts
export interface WatermarkProps {
  // 层级
  zIndex?: number
  // 旋转角度
  rotate?: number
  // 宽度
  width?: number
  // 高度
  height?: number
  // 内容
  content?: string | string[]
  // 字体相关
  font?: {
    color?: string
    fontSize?: number | string
    fontWeight?: 'normal' | 'light' | 'weight' | number
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
    fontFamily?: string
  }
  // 样式相关
  style?: CSSProperties
  // className?: string
  // rootClassName?: string
  // 间隔
  gap?: [number, number]
  // 偏移量
  offset?: [number, number]
}
```
