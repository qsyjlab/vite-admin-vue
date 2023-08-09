<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <Watermark :content="'组件水印'">
        <div style="height: 200px">组件水印</div>
      </Watermark>
    </el-card>

    <el-card style="margin-bottom: 20px">
      <div>hook 水印</div>
      <div ref="hookWaterRef" style="position: relative; height: 200px"></div>
    </el-card>
    <el-card style="margin-bottom: 20px">
      <div>vue 指令 水印</div>
      <div v-watermark="{ content: '指令水印' }" style="position: relative; height: 200px"></div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { useWaterMark, Watermark } from '@/components/watermark'
import { ref, onMounted } from 'vue'

const hookWaterRef = ref<HTMLElement | null>(null)

const { render } = useWaterMark(hookWaterRef, {
  content: 'hook 水印'
})

onMounted(() => {
  render()
})
</script>
<style scoped></style>
