import { ElDialog, DialogProps } from 'element-plus'
import { computed, defineComponent, h, reactive } from 'vue'

export interface IDialogProps extends Partial<Mutable<DialogProps>> {
  name: string
  default?: any
  footer?: any
}

export function useDialog(dialogProps: IDialogProps) {
  const state = reactive({
    dialogVisible: false
  })

  const show = () => {
    state.dialogVisible = true
  }

  const close = () => {
    state.dialogVisible = false
  }

  const component = defineComponent({
    name: dialogProps.name,
    setup(props, { slots, attrs }) {
      const dynamicProps = computed<Partial<DialogProps>>(() => {
        return {
          ...dialogProps,
          ...attrs,
          ...props
        }
      })

      const renderSlots: {
        footer?: (...args: any[]) => any
        default?: (...args: any[]) => any
      } = {}

      if (slots.footer || dialogProps.footer) {
        renderSlots.footer = () => h((slots.footer as any) || (dialogProps.footer as any))
      }

      if (slots.default || dialogProps.default) {
        renderSlots.default = () => h((slots.default as any) || (dialogProps.default as any))
      }

      return () =>
        h(
          ElDialog,
          {
            ...dynamicProps.value,
            modelValue: state.dialogVisible,
            'onUpdate:modelValue': value => {
              state.dialogVisible = value
            }
          },
          renderSlots
        )
    }
  })

  return [component, { show, close }]
}
