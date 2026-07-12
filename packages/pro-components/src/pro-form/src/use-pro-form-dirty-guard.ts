import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import type { FormMethodsType, FormModel } from './types/form'

export interface UseProFormDirtyGuardOptions {
  enabled?: () => boolean
  message?: string
  confirm?: (message: string) => boolean | Promise<boolean>
  beforeUnload?: boolean
}

export function useProFormDirtyGuard<TModel extends FormModel>(
  formRef: Readonly<Ref<FormMethodsType<TModel> | null>>,
  options: UseProFormDirtyGuardOptions = {}
) {
  const message = options.message ?? '表单存在未保存的修改，确定离开当前页面吗？'

  async function canLeave() {
    if (options.enabled?.() === false || !formRef.value?.isDirty()) return true
    return options.confirm ? options.confirm(message) : window.confirm(message)
  }

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (options.enabled?.() === false || !formRef.value?.isDirty()) return
    event.preventDefault()
    event.returnValue = message
  }

  onBeforeRouteLeave(() => canLeave())

  if (options.beforeUnload !== false) {
    onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
    onBeforeUnmount(() => window.removeEventListener('beforeunload', handleBeforeUnload))
  }

  return { canLeave }
}
