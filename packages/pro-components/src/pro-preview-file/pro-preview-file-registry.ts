import { markRaw, type Component } from 'vue'
import type { ProPreviewFileKind } from './pro-preview-file'

export type ProPreviewFileRendererKind = Exclude<ProPreviewFileKind, 'image' | 'unsupported'>

const rendererMap = new Map<ProPreviewFileRendererKind, Component>()

export function registerProPreviewFileRenderer(
  kind: ProPreviewFileRendererKind,
  component: Component
) {
  rendererMap.set(kind, markRaw(component))
}

export function getProPreviewFileRenderer(kind: ProPreviewFileKind) {
  if (kind === 'image' || kind === 'unsupported') return undefined
  return rendererMap.get(kind)
}
