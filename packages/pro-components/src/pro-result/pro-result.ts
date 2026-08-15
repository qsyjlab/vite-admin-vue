import type { CSSProperties, VNodeChild } from 'vue'

export type ProResultStatus = 'success' | 'error' | 'warning' | 'info' | '403' | '404' | '500'

export interface ProResultProps {
  status?: ProResultStatus
  title?: string
  subTitle?: string
  primaryText?: string
  secondaryText?: string
  bodyStyle?: CSSProperties
}

export interface ProResultSlots {
  icon?: () => VNodeChild
  title?: () => VNodeChild
  subTitle?: () => VNodeChild
  extra?: () => VNodeChild
  default?: () => VNodeChild
}
