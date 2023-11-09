import { FormSchema, ProForm, useProForm } from '@/components'
import { Fragment, defineComponent, h, nextTick } from 'vue'
import { useDialog } from './use-dialog'

import type { FormProps } from '@/components/pro-form/src/form-props'
import { ElButton } from 'element-plus'

interface IDialogForm<T = Record<string, any>, D = Record<string, any>> {
  fields?: FormSchema[]
  formProps?: Partial<FormProps>
  addRequest?: (data: T) => Promise<any>
  editRequest?: (id: number | string, data: T) => Promise<any>
  getRequest?: (id: number | string) => Promise<D>
}

interface IState {
  id?: _ID
}

type _ID = number | string

export function useDialogForm(dialogFormProps?: IDialogForm) {
  const [Dialog, dialogCommand] = useDialog()

  const { register, validate, forceUpdateModel, clearValidate, resetFields } = useProForm()

  const state: IState = {
    id: undefined
  }

  const show = async (id?: _ID) => {
    state.id = id
    dialogCommand.show()
    await nextTick(() => {
      resetFields()
      clearValidate()
    })
  }

  const close = () => {
    resetFields()
    clearValidate()
    dialogCommand.close()
  }

  const updateModel = (model: any) => {
    forceUpdateModel(model)
  }

  const component = defineComponent({
    emits: ['success', 'error'],
    setup(_, { attrs, emit, slots }) {
      console.log('slots', slots)

      const customSlots: any = {}
      Object.keys(slots).forEach(key => {
        customSlots[key] = (...args: any) => slots[key]?.(...args)
      })

      function getCustomSlots() {
        const customSlots: any = {}
        Object.keys(slots).forEach(key => {
          customSlots[key] = (...args: any) => slots[key]?.(...args)
        })
        return customSlots
      }

      function renderForm() {
        return h(
          ProForm,
          { ...dialogFormProps, ...attrs, onRegister: register },
          {
            ...getCustomSlots()
          }
        )
      }

      function submit() {
        validate(model => {
          if (state.id) {
            dialogFormProps
              ?.editRequest?.(state.id, model)
              .then((...res) => {
                emit('success', ...res)
                close()
              })
              .catch(err => {
                emit('error', err)
              })
          } else {
            dialogFormProps
              ?.addRequest?.(model)
              .then((...res) => {
                emit('success', ...res)
                close()
              })
              .catch(err => {
                emit('error', err)
              })
          }
        })
      }

      function cancel() {
        close()
        return
      }

      return () => {
        return h(
          Dialog,
          {},
          {
            default: () => renderForm(),
            footer: () => {
              return h(Fragment, {}, [
                h(ElButton, { onClick: cancel }, () => '取消'),
                h(ElButton, { type: 'primary', onClick: submit }, () => '确定')
              ])
            }
          }
        )
      }
    }
  })

  return [
    component,
    {
      show,
      close,
      updateModel
    }
  ]
}
