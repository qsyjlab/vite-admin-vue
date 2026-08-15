# Anchor 锚点

目录锚点 同 antd anchor

## Props

| 属性       | 说明       | 类型                                                 | 默认值   |
| ---------- | ---------- | ---------------------------------------------------- | -------- |
| modelValue | v-model    | AnchorItem['link']                                   |          |
| container  | 容器       | HTMLElement \| Window \| string(符合 query 查询规则) | Window   |
| anchors    | 锚点列表   | AnchorItem                                           | []       |
| direction  | 方向       | 'vertical' \| 'horizontal'                           | vertical |
| bounds     | 边界容错值 | number                                               | 5        |

## Evens

| 事件名称           | 说明 | 类型                                    |
| ------------------ | ---- | --------------------------------------- |
| update:model-value |      | (activeLink: AnchorItem['link'])=> void |
| change             |      | (activeLink: AnchorItem['link'])=> void |

## Type

- AnchorItem

  ```ts
  interface AnchorItem {
    title: string
    link: string
    children?: AnchorItem[]
  }
  ```
