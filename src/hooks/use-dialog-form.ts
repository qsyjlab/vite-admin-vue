import { defineComponent, h } from 'vue'

import ProDialogForm from '@/components/pro-form-dialog/src/pro-dialog-form.vue'
import type { IDialogExpose, IDialogForm } from '@/components/pro-form-dialog/src/types'
import { ref } from 'vue'

export function useDialogForm(props?: IDialogForm) {
  const dialogFormRef = ref<IDialogExpose>()

  const component = defineComponent({
    setup(_, { attrs, slots }) {
      const customSlots: any = {}
      Object.keys(slots).forEach(key => {
        customSlots[key] = (...args: any) => slots[key]?.(...args)
      })
      function setRef(ref: any) {
        dialogFormRef.value = ref
      }
      return () => {
        return h(ProDialogForm, { ref: setRef, ...props, ...attrs }, customSlots)
      }
    }
  })

  return [
    component,
    {
      show: (...args: Parameters<IDialogExpose['show']>) => {
        dialogFormRef.value?.show(...args)
      },
      close: (...args: Parameters<IDialogExpose['close']>) => {
        dialogFormRef.value?.close(...args)
      }
    }
  ]
}
