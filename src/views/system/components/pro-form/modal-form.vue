<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button @click="_show">打开</el-button>
      <el-button @click="close">关闭</el-button>
      <!-- <VModalForm title="modal 表单" :fields="fields" @submit="submit" /> -->
      <!-- <pro-modal></pro-modal> -->
      <TestDialog :title="'123123'">
        中间内容渲染
        <template #footer> 测试页脚渲染 </template>
      </TestDialog>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
// import { VModalForm } from '@/components/pro-form'
import { PageWrapper, PageCard } from '@/components'
import { useDialog, IDialogProps } from '@/hooks/use-dialog'
import { reactive } from 'vue'

const dialogProps = reactive<IDialogProps>({
  name: 'TestDialog',
  title: '这是dialog 标题',
  fullscreen: true,
  openDelay: 200,
  onClose: () => {
    console.log('close use')

    return true
  }
})
const [TestDialog, { show, close }] = useDialog(dialogProps)

const _show = () => {
  console.log('show')
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
