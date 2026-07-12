<template>
  <div class="pro-steps-form">
    <el-steps :active="current" align-center finish-status="success">
      <el-step
        v-for="(step, index) in steps"
        :key="step.key"
        :title="step.title"
        :description="step.description"
        @click="goTo(index)"
      />
    </el-steps>

    <div v-if="currentStep" class="pro-steps-form__content">
      <slot name="before-step" :step="currentStep" :current="current" />
      <pro-form
        :key="currentStep.key"
        ref="formRef"
        v-bind="currentStep.formProps"
        :model="values"
        :fields="currentStep.fields"
        enable-effect
        @effect="handleEffect"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="scope">
          <slot v-if="!reservedSlots.includes(String(slotName))" :name="slotName" v-bind="scope" />
        </template>
      </pro-form>
      <slot name="after-step" :step="currentStep" :current="current" />
    </div>

    <div class="pro-steps-form__actions">
      <slot
        name="actions"
        :current="current"
        :next="next"
        :previous="previous"
        :submit="submit"
        :loading="loading"
      >
        <el-button v-if="current > 0" :disabled="loading" @click="previous">
          {{ previousText }}
        </el-button>
        <el-button v-if="current < steps.length - 1" type="primary" @click="next">
          {{ nextText }}
        </el-button>
        <el-button v-else type="primary" :loading="loading" @click="submit">
          {{ submitText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TModel extends FormModel = FormModel, TResult = unknown">
import { computed, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ElButton, ElStep, ElSteps } from 'element-plus'
import {
  ProForm,
  transformFormValues,
  useProForm,
  type FormMethodsType,
  type FormModel
} from '../pro-form'
import type { ProStepsFormExpose, ProStepsFormProps } from './pro-steps-form'

defineOptions({ name: 'ProStepsForm' })

const props = withDefaults(defineProps<ProStepsFormProps<TModel, TResult>>(), {
  steps: () => [],
  initialValues: () => ({}) as TModel,
  previousText: '上一步',
  nextText: '下一步',
  submitText: '提交'
})
const emit = defineEmits<{
  'update:model-value': [values: TModel]
  change: [current: number, values: TModel]
  success: [result: TResult | undefined, values: TModel]
  error: [error: unknown]
}>()
const current = defineModel<number>('current', { default: 0 })
const values = shallowRef<TModel>(cloneDeep(props.initialValues))
const loading = ref(false)
const result = ref<TResult>()
const formRef = useTemplateRef<FormMethodsType<TModel>>('formRef')
const form = useProForm(formRef)
const reservedSlots = ['before-step', 'after-step', 'actions']
const currentStep = computed(() => props.steps[current.value])

watch(
  () => props.initialValues,
  value => {
    values.value = cloneDeep(value)
  },
  { deep: true }
)

function handleEffect(nextValues: FormModel) {
  const typedValues = cloneDeep(nextValues) as TModel
  values.value = typedValues
  emit('update:model-value', cloneDeep(typedValues))
}

async function syncCurrentValues() {
  if (!formRef.value) return
  values.value = await form.getFieldsValue({ transform: false })
  emit('update:model-value', cloneDeep(values.value))
}

async function validateCurrent() {
  if (!formRef.value) return false
  const valid = await form.validate()
  if (valid) await syncCurrentValues()
  return valid
}

async function next() {
  if (!currentStep.value || !(await validateCurrent())) return false
  if (currentStep.value.beforeNext && !(await currentStep.value.beforeNext(values.value))) {
    return false
  }
  if (current.value >= props.steps.length - 1) return submit()
  current.value += 1
  emit('change', current.value, cloneDeep(values.value))
  await nextTick()
  return true
}

function previous() {
  if (current.value <= 0) return
  void syncCurrentValues()
  current.value -= 1
  emit('change', current.value, cloneDeep(values.value))
}

async function goTo(index: number) {
  if (index < 0 || index >= props.steps.length || index === current.value) return false
  if (index < current.value) {
    await syncCurrentValues()
    current.value = index
    emit('change', current.value, cloneDeep(values.value))
    return true
  }
  if (index === current.value + 1) return next()
  return false
}

async function submit() {
  if (loading.value || !(await validateCurrent())) return false
  const allFields = props.steps.flatMap(step => step.fields)
  const submitValues = transformFormValues(values.value, allFields)
  loading.value = true
  try {
    const finishResult = props.onFinish ? await props.onFinish(submitValues) : undefined
    if (finishResult === false) return false
    result.value = finishResult as TResult | undefined
    emit('success', result.value, submitValues)
    return true
  } catch (error) {
    emit('error', error)
    return false
  } finally {
    loading.value = false
  }
}

async function reset() {
  values.value = cloneDeep(props.initialValues)
  current.value = 0
  result.value = undefined
  await nextTick()
  if (formRef.value) await form.resetFields()
  emit('update:model-value', cloneDeep(values.value))
}

const exposed: ProStepsFormExpose<TModel, TResult> = {
  getCurrent: () => current.value,
  getLoading: () => loading.value,
  getValues: () => cloneDeep(values.value),
  getForm: () => formRef.value,
  getResult: () => result.value,
  next,
  previous,
  goTo,
  submit,
  reset
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-steps-form {
  min-width: 0;

  &__content {
    min-width: 0;
    margin-top: 28px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
  }
}
</style>
