<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button type="primary" @click="show">显示</el-button>
      <DialogTempalte>
        <template #footer>
          <el-button @click="dialogCommand.show()">显示dialog2</el-button>
          <el-button @click="close">关闭</el-button>
        </template>
      </DialogTempalte>

      <DialogTempalte2 append-to-body destroy-on-close fullscreen>
        <template #footer>
          <el-button @click="dialogCommand.close()">关闭</el-button>
        </template>
      </DialogTempalte2>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageWrapper, PageCard } from '@/components'
import { useDialog } from '@/hooks/use-dialog'
const [DialogTempalte, { close, show }] = useDialog({
  title: 'dialog',
  appendToBody: true
})

const [DialogTempalte2, dialogCommand] = useDialog()
</script>
<style scoped></style>
