<template>
  <page-wrapper class="anchor-page">
    <g-page-header
      title="锚点"
      description="演示 Anchor 组件的垂直/水平模式、v-model 高亮与 bounds 偏移动态调整。"
      :icon="Position"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">垂直模式</el-tag>
        <el-tag effect="plain" type="success">水平模式</el-tag>
      </template>
    </g-page-header>

    <pro-card title="垂直模式" subtitle="1 秒后自动定位到 part-3，bounds 调整为 30">
      <div class="anchor-page__layout">
        <Anchor
          v-model="activeAnchor"
          :container="() => containerRef!"
          :anchors="anchors"
          :bounds="bounds"
          @change="anchorChangeHandler"
        />

        <div ref="containerRef" class="anchor-page__container">
          <div id="part-1" class="ac-container anchor-page__tint--red">part-1</div>
          <div id="part-4" class="ac-container anchor-page__tint--blue">part-4</div>
          <div id="part-5" class="ac-container anchor-page__tint--blue">part-5</div>
          <div id="part-2" class="ac-container anchor-page__tint--green">part-2</div>
          <div id="part-3" class="ac-container anchor-page__tint--blue">part-3</div>
        </div>
      </div>
    </pro-card>

    <pro-card title="horizontal 模式">
      <div class="anchor-page__layout">
        <Anchor
          :container="() => container2Ref!"
          :anchors="horizontalAnchors"
          direction="horizontal"
        />

        <div ref="container2Ref" class="anchor-page__container">
          <div
            v-for="(item, index) in horizontalAnchors"
            :id="item.link"
            :key="index"
            class="ac-container anchor-page__tint--red"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Position } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { GPageHeader, PageWrapper } from '@/components'
import { Anchor } from '@/components/anchor'

const containerRef = ref<HTMLElement>()
const container2Ref = ref<HTMLElement>()
const activeAnchor = ref<string>('part-4')
const bounds = ref<number>(40)

setTimeout(() => {
  activeAnchor.value = 'part-3'
  bounds.value = 30
}, 1000)

const anchors = [
  {
    title: 'part-1',
    link: 'part-1',
    children: [
      {
        title: 'part-4',
        link: 'part-4'
      },
      {
        title: 'part-5',
        link: 'part-5'
      }
    ]
  },
  {
    title: 'part-2',
    link: 'part-2'
  },
  {
    title: 'part-3',
    link: 'part-3'
  }
]

const horizontalAnchors = [
  {
    title: 'part-11',
    link: 'part-11',
    children: [
      {
        title: 'part-12',
        link: 'part-12'
      },
      {
        title: 'part-13',
        link: 'part-13'
      }
    ]
  },
  {
    title: 'part-21',
    link: 'part-21'
  },
  {
    title: 'part-31',
    link: 'part-32'
  }
]

const anchorChangeHandler = (link: string) => {
  console.log('link anchorChangeHandler', link)
}
</script>
<style lang="scss" scoped>
.anchor-page {
  gap: 16px;

  &__layout {
    display: flex;
    gap: 24px;
  }

  &__container {
    flex: 1 1 auto;
    min-width: 0;
    height: 500px;
    overflow: auto;
  }

  &__tint--red {
    background-color: rgba(255, 0, 0, 0.02);
  }

  &__tint--blue {
    background-color: rgba(0, 0, 255, 0.02);
  }

  &__tint--green {
    background-color: rgba(0, 255, 0, 0.02);
  }
}

.ac-container {
  height: 50vh;
  border: 1px solid blue;
}
</style>
