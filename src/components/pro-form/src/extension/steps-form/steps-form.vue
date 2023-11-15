<template>
  <el-steps :active="active" align-center>
    <el-step v-for="(step, index) in steps" :key="index" :title="step.title"> </el-step>
  </el-steps>
  <template v-for="(step, index) in steps" :key="index">
    <base-form
      v-show="active === index + 1"
      :fields="step.form"
      @register="stepFormInstanceMap[index].register"
    ></base-form>
  </template>

  <div>
    <el-space>
      <el-button v-if="active > info.start" @click="lastStep">上一步</el-button>
      <el-button v-if="active < info.end" type="primary" :loading="waitDone" @click="nextStep"
        >下一步</el-button
      >
      <el-button v-else type="primary" :loading="waitDone" @click="submit">提交</el-button>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import BaseForm from '../../base-form.vue'
import { useProForm } from '../../use-pro-form'
import stepsProps from './props'

const props = defineProps(stepsProps)
const emits = defineEmits({
  submit: (
    currentValues: Record<string, any>,
    allValues: Record<string, any>[],
    done: () => void
  ) => currentValues && allValues && done
})

const info = {
  start: 1,
  end: props.steps.length
}

const active = ref(1)
const stepFormValues: Record<string, any>[] = []

const stepFormInstanceMap: Record<number, ReturnType<typeof useProForm>> = {}

props.steps.forEach((step, index) => {
  stepFormInstanceMap[index] = useProForm()
  stepFormValues.push({})
})

let waitDone = ref(false)

function done() {
  waitDone.value = false
}

function next() {
  active.value++
  done()
}

const nextStep = () => {
  if (active.value >= info.end) return

  if (waitDone.value) return

  const formInstance = stepFormInstanceMap[active.value - 1]

  formInstance.validate(model => {
    waitDone.value = true
    stepFormValues[active.value - 1] = model

    if (typeof props.steps[active.value - 1].beforeNext === 'function') {
      props.steps[active.value - 1].beforeNext?.(model, next)
    } else {
      next()
    }
  })
}

const lastStep = () => {
  if (active.value <= info.start) return
  active.value--
}

const submit = () => {
  const formInstance = stepFormInstanceMap[active.value - 1]

  waitDone.value = true

  formInstance.validate(model => {
    stepFormValues[active.value - 1] = model

    emits('submit', model, stepFormValues, done)
  })
}
</script>
<style scoped></style>
