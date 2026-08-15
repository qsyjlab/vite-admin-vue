import { reactive } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useForm } from '../form'
import type { FormEmit, NormalizedFormProps } from '../form-props'
import type { FormModel, FormSchema } from '../types/form'

interface TestModel extends FormModel {
  name: string
  enabled: boolean
}

function setup(overrides: Partial<NormalizedFormProps<TestModel>> = {}) {
  const props = reactive({
    fields: [{ key: 'name', name: 'name', label: '姓名' }] as FormSchema<TestModel>[],
    model: { name: 'initial', enabled: true },
    inline: false,
    layout: true,
    enableEffect: false,
    collapsible: true,
    defaultCollapsed: false,
    collapsedRows: 1,
    expandOnInvalid: true,
    autoRequest: true,
    ...overrides
  }) as NormalizedFormProps<TestModel>
  const emit = vi.fn() as unknown as FormEmit<TestModel>
  const form = useForm({ props, emits: emit })
  return { props, emit, form }
}

describe('useForm state', () => {
  it('tracks dirty state against an explicit clean baseline', () => {
    const { form } = setup()

    expect(form.dirty.value).toBe(false)
    form.setFieldValue('name', 'changed')
    expect(form.dirty.value).toBe(true)

    form.markClean()
    expect(form.dirty.value).toBe(false)
  })

  it('loads asynchronous initial values and marks them clean', async () => {
    const request = vi.fn(async () => ({ name: 'remote' }))
    const { form } = setup({ request, autoRequest: false })

    await expect(form.load()).resolves.toMatchObject({ name: 'remote', enabled: true })
    expect(request).toHaveBeenCalledTimes(1)
    expect(form.formModel.value).toEqual({ name: 'remote', enabled: true })
    expect(form.dirty.value).toBe(false)
  })

  it('prevents concurrent submissions and marks successful values clean', async () => {
    let resolveSubmit!: () => void
    const onFinish = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveSubmit = resolve
        })
    )
    const { form } = setup({ onFinish })
    form.setFormRef({ validate: vi.fn(async () => true) } as never)
    form.setFieldValue('name', 'submitted')

    const first = form.submit()
    const second = form.submit()
    await expect(second).resolves.toBe(false)
    expect(onFinish).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await expect(first).resolves.toBe(true)
    expect(form.dirty.value).toBe(false)
  })
})
