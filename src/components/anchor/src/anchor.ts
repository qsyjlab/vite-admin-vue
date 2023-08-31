export type AnchorContainer = HTMLElement | Window

export interface AnchorItem {
  title: string
  link: string
  children?: AnchorItem[]
}
