<template>
  <page-wrapper class="watermark-page">
    <g-page-header
      title="水印"
      description="演示 Watermark 组件、useWaterMark hook 与 v-watermark 指令三种接入方式，参数实时联动。"
      :icon="Stamp"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">组件</el-tag>
        <el-tag effect="plain" type="success">hook</el-tag>
        <el-tag effect="plain" type="warning">指令</el-tag>
      </template>
    </g-page-header>

    <pro-card title="自定义配置">
      <pre class="watermark-page__code">
          {{ watermarkProps }}
      </pre>
      <ProForm
        :fields="proFormFields"
        :model="state"
        label-position="top"
        enable-effect
        @effect="formEffect"
      />
    </pro-card>

    <pro-card title="组件水印">
      <Watermark v-bind="watermarkProps">
        <div class="watermark-page__canvas"></div>
      </Watermark>
    </pro-card>

    <pro-card title="hook 水印">
      <div ref="hookWaterRef" class="watermark-page__canvas watermark-page__canvas--relative"></div>
    </pro-card>

    <pro-card title="vue 指令 水印">
      <div
        v-watermark="watermarkProps"
        class="watermark-page__canvas watermark-page__canvas--relative"
      ></div>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Stamp } from '@element-plus/icons-vue'
import { useWaterMark, Watermark } from '@/components/watermark'
import type { WatermarkProps } from '@/components/watermark'
import { GPageHeader, PageWrapper } from '@/components'
import { ProForm, type FormSchema } from '@framebase/element-plus-pro-components'
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
<style scoped lang="scss">
.watermark-page {
  gap: 16px;

  &__code {
    margin: 0 0 12px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  &__canvas {
    height: 200px;

    &--relative {
      position: relative;
    }
  }
}
</style>
