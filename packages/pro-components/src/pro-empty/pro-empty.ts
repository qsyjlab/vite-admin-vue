import type { CSSProperties, VNodeChild } from 'vue'

export type ProEmptyStatus = 'empty' | 'search' | 'error' | 'forbidden'

export interface ProEmptyProps {
  status?: ProEmptyStatus
  title?: string
  description?: string
  image?: string
  imageSize?: number | string
  compact?: boolean
  actionText?: string
  secondaryActionText?: string
  bodyStyle?: CSSProperties
}

export interface ProEmptySlots {
  image?: () => VNodeChild
  title?: () => VNodeChild
  description?: () => VNodeChild
  extra?: () => VNodeChild
}
