import { shallowReactive } from 'vue'
import type { ProFieldRendererDefinition } from './pro-field'

const fieldRendererRegistry = shallowReactive(new Map<string, ProFieldRendererDefinition>())

export function registerProField(
  valueType: string,
  definition: ProFieldRendererDefinition
): () => void {
  const previous = fieldRendererRegistry.get(valueType)
  fieldRendererRegistry.set(valueType, definition)

  return () => {
    if (fieldRendererRegistry.get(valueType) !== definition) return
    if (previous) fieldRendererRegistry.set(valueType, previous)
    else fieldRendererRegistry.delete(valueType)
  }
}

export function unregisterProField(valueType: string): boolean {
  return fieldRendererRegistry.delete(valueType)
}

export function getProFieldRenderer(valueType: string) {
  return fieldRendererRegistry.get(valueType)
}

export function hasProFieldRenderer(valueType: string) {
  return fieldRendererRegistry.has(valueType)
}
