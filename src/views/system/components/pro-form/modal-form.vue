<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button @click="show">hook 打开 dialog</el-button>

      <el-button @click="dialogFormCommand.show()">打开</el-button>

      <el-button @click="dialogFormCommand.show(1)">编辑</el-button>
      <TestDialog :title="'123123'" append-to-body @close="closeCallback">
        <template #header>123213</template>
        内容部分渲染
        <template #footer>
          <el-button @click="close"> 关闭 </el-button>
        </template>
      </TestDialog>

      <ProDialogForm />
      <DialogFormTemplate />
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageWrapper, PageCard } from '@/components'
import { useDialog, IDialogProps } from '@/hooks/use-dialog'
import { reactive } from 'vue'
import { useDialogForm } from '@/hooks/use-dialog-form'
import ProDialogForm from '@/components/pro-form-dialog/src/pro-dialog-form.vue'

const [DialogFormTemplate, dialogFormCommand] = useDialogForm({
  title: '标题',
  fields: [{ label: '测试表单1', key: 'test1', el: 'el-input' }],
  cancelText: '关闭',
  confirmText: '确定',
  addRequest: data => {
    console.log('data', data)
    return Promise.resolve(data)
  },
  getRequest: () => {
    return Promise.resolve({
      test1: '测试数据'
    })
  },
  editRequest: () => {
    return Promise.resolve()
  },
  onSuccess(data) {
    console.log('sucess', data)
  }
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
