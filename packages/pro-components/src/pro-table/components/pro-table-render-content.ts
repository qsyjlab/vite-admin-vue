import { defineComponent, type PropType, type VNodeChild } from 'vue'

export const ProTableRenderContent = defineComponent({
  name: 'ProTableRenderContent',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(props) {
    return () => props.content
  }
})
