import { defineComponent, h } from 'vue'
import Transiton from './transition.vue'

export function createTransition(name: string, attrs: Record<string, any>) {
  return defineComponent({
    name,
    setup(props, { slots }) {
      return () => h(Transiton, attrs, () => slots.default?.())
    }
  })
}
