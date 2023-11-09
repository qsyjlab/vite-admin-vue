import { ElDialog, DialogProps, DialogEmits } from 'element-plus'
import { DefineComponent, computed, defineComponent, h, reactive } from 'vue'

type OnEvents<E> = {
  [key in keyof E as `on${Capitalize<string & key>}`]: () => void
}

type _DialogProps = Partial<Mutable<DialogProps>> &
  Partial<OnEvents<Omit<DialogEmits, 'update:modelValue'>>>

export interface IDialogProps extends _DialogProps {
  name?: string
  default?: any
  footer?: any
}

type DialogComponent = DefineComponent<_DialogProps> & {
  new (): {
    $slots: {
      default(): any
      footer(): any
      header(): any
    }
  }
}

interface DialogCommand {
  show: () => void
  close: () => void
}

export function useDialog(dialogProps: IDialogProps): [DialogComponent, DialogCommand] {
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
    setup(_, { slots, attrs }) {
      const dynamicProps = computed<Partial<_DialogProps>>(() => {
        return {
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
  return [component as any, { show, close }]
}
