import { ref, shallowRef } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { ProFormContainerBehavior } from '../pro-form-container'
import type { FormMethodsType } from '../types/form'
import { useProFormContainer } from '../use-pro-form-container'

interface TestFormModel {
  name?: string
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

function createForm(
  overrides: Partial<FormMethodsType<TestFormModel>> = {}
): FormMethodsType<TestFormModel> {
  return {
    submit: vi.fn(async () => true),
    reset: vi.fn(),
    validate: vi.fn(async () => true),
    resetFields: vi.fn(),
    clearValidate: vi.fn(),
    validateField: vi.fn(async () => true),
    scrollToField: vi.fn(),
    forceUpdateModel: vi.fn(),
    setFieldValue: vi.fn(),
    getFieldValue: vi.fn(),
    getFieldsValue: vi.fn(() => ({ name: 'current' })),
    setFieldErrors: vi.fn(),
    clearFieldErrors: vi.fn(),
    getCollapsed: vi.fn(() => false),
    setCollapsed: vi.fn(),
    toggleCollapse: vi.fn(),
    load: vi.fn(async () => ({ name: 'loaded' })),
    getLoading: vi.fn(() => false),
    getRequestLifecycle: vi.fn(() => ({
      phase: 'idle',
      loading: false,
      initialLoading: false,
      refreshing: false
    })),
    getError: vi.fn(),
    retryRequest: vi.fn(async () => ({ name: 'loaded' })),
    cancelRequest: vi.fn(),
    getSubmitting: vi.fn(() => false),
    isDirty: vi.fn(() => false),
    markClean: vi.fn(),
    ...overrides
  }
}

function createContainer<TResult = unknown>(
  behavior: ProFormContainerBehavior<TestFormModel, TResult>,
  form = createForm()
) {
  const visible = ref(false)
  const formRef = shallowRef<FormMethodsType<TestFormModel> | null>(form)
  const onSuccess = vi.fn()
  const onError = vi.fn()
  const container = useProFormContainer<TestFormModel, TResult>({
    visible,
    formRef,
    getBehavior: () => behavior,
    onSuccess,
    onError
  })

  return { container, form, visible, onSuccess, onError }
}

describe('use pro form container', () => {
  it('tracks load state and ignores a stale load from an earlier open', async () => {
    const firstLoad = createDeferred<Partial<TestFormModel>>()
    const secondLoad = createDeferred<Partial<TestFormModel>>()
    const firstStarted = createDeferred<boolean>()
    const secondStarted = createDeferred<boolean>()
    const load = vi.fn((id: string | number) => {
      if (id === 1) {
        firstStarted.resolve(true)
        return firstLoad.promise
      }

      secondStarted.resolve(true)
      return secondLoad.promise
    })
    const { container, form } = createContainer({ load })

    const firstOpen = container.open({ id: 1 })
    await firstStarted.promise

    expect(container.loading.value).toBe(true)
    expect(container.loadingData.value).toBe(true)

    const secondOpen = container.open({ id: 2 })
    await secondStarted.promise
    secondLoad.resolve({ name: 'latest' })
    await secondOpen

    expect(container.loading.value).toBe(false)
    expect(container.loadingData.value).toBe(false)
    expect(form.forceUpdateModel).toHaveBeenLastCalledWith({ name: 'latest' })

    firstLoad.resolve({ name: 'stale' })
    await firstOpen

    expect(form.forceUpdateModel).not.toHaveBeenCalledWith({ name: 'stale' })
    expect(form.forceUpdateModel).toHaveBeenLastCalledWith({ name: 'latest' })
  })

  it('runs beforeSubmit before validation and lets false stop submission', async () => {
    const order: string[] = []
    let allowSubmit = false
    const form = createForm({
      validate: vi.fn(async () => {
        order.push('validate')
        return true
      })
    })
    const beforeSubmit = vi.fn(async (currentForm: FormMethodsType<TestFormModel>) => {
      expect(currentForm).toBe(form)
      order.push('beforeSubmit')
      return allowSubmit
    })
    const onFinish = vi.fn(async () => {
      order.push('onFinish')
      return 'saved'
    })
    const { container } = createContainer({ beforeSubmit, onFinish, closeOnSuccess: false }, form)

    await expect(container.submit()).resolves.toBe(false)
    expect(order).toEqual(['beforeSubmit'])
    expect(form.validate).not.toHaveBeenCalled()
    expect(onFinish).not.toHaveBeenCalled()

    order.length = 0
    allowSubmit = true

    await expect(container.submit()).resolves.toBe(true)
    expect(order).toEqual(['beforeSubmit', 'validate', 'onFinish'])
  })

  it('exposes submitting independently while onFinish is pending', async () => {
    const finish = createDeferred<string>()
    const finishStarted = createDeferred<boolean>()
    const { container } = createContainer<string>({
      closeOnSuccess: false,
      onFinish: () => {
        finishStarted.resolve(true)
        return finish.promise
      }
    })

    const submitting = container.submit()
    await finishStarted.promise

    expect(container.loadingData.value).toBe(false)
    expect(container.submitting.value).toBe(true)
    expect(container.loading.value).toBe(true)

    finish.resolve('saved')

    await expect(submitting).resolves.toBe(true)
    expect(container.submitting.value).toBe(false)
    expect(container.loading.value).toBe(false)
    expect(container.result.value).toBe('saved')
  })

  it('clears the previous result whenever the container opens again', async () => {
    const { container, visible } = createContainer<string>({
      closeOnSuccess: false,
      onFinish: () => 'saved'
    })

    await container.submit()
    expect(container.result.value).toBe('saved')

    const opening = container.open({ values: { name: 'next' } })

    expect(container.result.value).toBeUndefined()
    expect(visible.value).toBe(true)
    await opening
  })

  it('maps submit errors and forwards field errors to the form instance', async () => {
    const submitError = new Error('invalid order')
    const fieldErrors = [{ name: 'name' as const, errors: ['Name already exists'] }]
    const mapError = vi.fn(() => fieldErrors)
    const { container, form, onError } = createContainer({
      closeOnSuccess: false,
      mapError,
      onFinish: async () => {
        throw submitError
      }
    })

    await expect(container.submit()).resolves.toBe(false)

    expect(mapError).toHaveBeenCalledWith(submitError)
    expect(form.setFieldErrors).toHaveBeenCalledWith(fieldErrors)
    expect(onError).toHaveBeenCalledWith(submitError)
    expect(container.submitting.value).toBe(false)
  })

  it('protects dirty values on close and force-closes after a successful submit', async () => {
    const confirmDirtyClose = vi.fn(async () => false)
    const form = createForm({ isDirty: vi.fn(() => true) })
    const { container, visible } = createContainer(
      {
        warnWhenDirty: true,
        confirmDirtyClose,
        onFinish: async () => 'saved'
      },
      form
    )

    visible.value = true
    await expect(container.close()).resolves.toBe(false)
    expect(visible.value).toBe(true)
    expect(confirmDirtyClose).toHaveBeenCalledWith('表单存在未保存的修改，确认关闭吗？')

    await expect(container.submit()).resolves.toBe(true)
    expect(visible.value).toBe(false)
    expect(confirmDirtyClose).toHaveBeenCalledTimes(1)
  })

  it('closes a dirty form after confirmation succeeds', async () => {
    const confirmDirtyClose = vi.fn(async () => true)
    const form = createForm({ isDirty: vi.fn(() => true) })
    const { container, visible } = createContainer({ warnWhenDirty: true, confirmDirtyClose }, form)

    visible.value = true

    await expect(container.close()).resolves.toBe(true)
    expect(visible.value).toBe(false)
    expect(confirmDirtyClose).toHaveBeenCalledTimes(1)
  })

  it('prevents every normal close path while submitting', async () => {
    const finish = createDeferred<string>()
    const finishStarted = createDeferred<boolean>()
    const { container, visible } = createContainer<string>({
      preventCloseWhileSubmitting: true,
      onFinish: () => {
        finishStarted.resolve(true)
        return finish.promise
      }
    })
    visible.value = true

    const submitting = container.submit()
    await finishStarted.promise

    await expect(container.close()).resolves.toBe(false)
    expect(visible.value).toBe(true)

    finish.resolve('saved')
    await expect(submitting).resolves.toBe(true)
    expect(visible.value).toBe(false)
  })
})
