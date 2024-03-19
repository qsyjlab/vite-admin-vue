import { Component, VNode } from 'vue'

export interface ProDescriptionsItem {
  key: string
  label?: string
  render?: () => number | string | undefined | null | VNode | Component
}

export type ProDescriptionColumns = ProDescriptionsItem[]
