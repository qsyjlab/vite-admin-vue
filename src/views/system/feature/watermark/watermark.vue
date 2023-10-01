<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <div>自定义配置</div>
      <pre>
          {{ watermarkProps }}
      </pre>
      <ProForm :fields="proFormFields" :model="state" label-position="top" @effect="formEffect" />
    </el-card>
    <el-card style="margin-bottom: 20px">
      <Watermark v-bind="watermarkProps">
        <div style="height: 200px">组件水印</div>
      </Watermark>
    </el-card>

    <el-card style="margin-bottom: 20px">
      <div>hook 水印</div>
      <div ref="hookWaterRef" style="position: relative; height: 200px"></div>
    </el-card>
    <el-card style="margin-bottom: 20px">
      <div>vue 指令 水印</div>
      <div v-watermark="watermarkProps" style="position: relative; height: 200px"></div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { useWaterMark, Watermark } from '@/components/watermark'
import type { WatermarkProps } from '@/components/watermark'
import { ProForm } from '@/components/pro-form'
import type { FormSchema } from '@/components/pro-form'
import { ref, onMounted, reactive, nextTick, computed } from 'vue'

const proFormFields: FormSchema[] = [
  {
    label: '水印文字',
    key: 'content',
    el: 'el-input'
  },
  {
    label: '字体颜色',
    key: 'color',
    el: 'el-color-picker'
  },
  {
    label: '字体大小',
    key: 'fontSize',
    el: 'el-slider'
  },
  {
    label: 'z-index',
    key: 'zIndex',
    el: 'el-slider'
  },
  {
    label: '旋转角度',
    key: 'rotate',
    el: 'el-slider',
    attrs: {
      min: -180,
      max: 180
    }
  }
]

const hookWaterRef = ref<HTMLElement | null>(null)

interface StateValue {
  content: string
  fontSize: number
  color: string
  zIndex: number
  rotate: number
}

const state = reactive<StateValue>({
  content: '测试水印',
  fontSize: 14,
  color: 'rgba(0, 0, 0, 0.15)',
  zIndex: 0,
  rotate: -22
})

const watermarkProps = computed<Partial<WatermarkProps>>(() => {
  return {
    content: state.content,
    font: {
      fontSize: state.fontSize,
      color: state.color
    },
    zIndex: state.zIndex,
    rotate: state.rotate
  }
})

const { render, destroy } = useWaterMark(hookWaterRef, watermarkProps)

onMounted(() => {
  render()
})

const formEffect = (values: Record<string, any>) => {
  Object.keys(values).forEach(key => {
    const _key = key as unknown as keyof StateValue
    //@ts-ignore
    state[_key] = values[_key]
  })
  destroy()
  nextTick(() => {
    render()
  })
}
</script>
<style scoped></style>
