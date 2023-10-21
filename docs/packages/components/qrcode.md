# Qrcode 二维码组件

根据内容生成二维码

## Props

| 属性       | 说明             | 类型                          | 默认值 |
| ---------- | ---------------- | ----------------------------- | ------ |
| version    | 二维码版本       | number                        |        |
| errorLevel | 纠错级别         | low\| medium\|quartile\| high |        |
| margin     | 四周边距         | number                        |        |
| scale      | 缩放             | number                        |        |
| text       | 二维码内容       | string                        |        |
| type       | 渲染类型         | ”canvas“                      | canvas |
| size       | 大小(宽 高)      | number                        | 160    |
| logo       | 中间 二维码 logo | LogoOptions                   |        |

## Type

```ts
interface IProps {
  /** 二维码版本 */
  version?: number
  /** 纠错级别 ： low, medium, quartile, high */
  errorLevel?: QRCodeRenderersOptions['errorCorrectionLevel']
  /** 四周边距 */
  margin?: number
  /** 缩放 */
  scale?: QRCodeRenderersOptions['scale']
  text: string
  type?: 'canvas'
  size?: number
  logo?: string | LogoOptions
}

interface LogoOptions {
  src: string
  size?: number
  bgColor?: string
  crossOrigin?: string
}
```
