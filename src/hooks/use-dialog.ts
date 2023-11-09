import { ElDialog, DialogProps, DialogEmits, dialogProps as elDialogProps } from 'element-plus'
import { computed, defineComponent, h, reactive } from 'vue'

type OnEvents<E> = {
  [key in keyof E as `on${Capitalize<string & key>}`]: E[key]
}

export interface IDialogProps extends Partial<Mutable<DialogProps> & OnEvents<DialogEmits>> {
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
    props: {
      ...elDialogProps,
      title: {
        type: String
      }
    },
    setup(props, { slots, attrs }) {
      // TODO: 尝试解决组件属性和 传入属性的冲突
      const dynamicProps = computed<Partial<DialogProps>>(() => {
        return {
          ...props,
          ...attrs,
          ...dialogProps
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
