<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button @click="dialogFormCommand.show()">打开</el-button>
      <TestDialog :title="'123123'" append-to-body @close="closeCallback">
        <template #header>123213</template>
        内容部分渲染
        <template #footer>
          <el-button @click="close"> 关闭 </el-button>
        </template>
      </TestDialog>

      <DialogFormTemplate>
        <template #test1>
          <el-col :span="14">
            <el-input
              v-model="state.str"
              @change="val => dialogFormCommand.updateModel({ str: val })"
            ></el-input>
          </el-col>
        </template>
      </DialogFormTemplate>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageWrapper, PageCard } from '@/components'
import { useDialog, IDialogProps } from '@/hooks/use-dialog'
import { reactive } from 'vue'

import { useDialogForm } from '@/hooks/use-dialog-form'

const [DialogFormTemplate, dialogFormCommand] = useDialogForm({
  fields: [{ label: '测试表单1', key: 'test1', el: 'el-input' }]
})

const state = reactive({
  str: ''
})

const closeCallback = () => {
  console.log('closed')
}

const dialogProps = reactive<IDialogProps>({
  name: 'TestDialog',
  title: '这是dialog 标题',
  fullscreen: false,
  openDelay: 200
})
const [TestDialog, { show, close }] = useDialog(dialogProps)

const _show = () => {
  show()
  setTimeout(() => {
    dialogProps.fullscreen = false
    dialogProps.openDelay = 300

    console.log('full')
  }, 5000)
}

const closeAfter = () => {
  console.log('close')

  return true
}

const fields = [
  {
    label: 'name',
    el: 'el-input',
    key: 'name',
    rules: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ]
  },
  {
    label: 'zone',
    el: 'el-input',
    key: 'zone',
    attrs: {
      options: [
        {
          label: '测试地区1',
          value: 1
        }
      ]
    }
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time123'
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time23'
  },
  {
    label: 'time',
    el: 'el-input',
    key: 'time2323'
  },

  {
    label: 'time',
    el: 'el-input',
    key: 'time23232'
  }
]

const submit = (values: Record<string, any>, done: () => void) => {
  console.log('values', values)
  done()
}
</script>
<style scoped></style>
