<template>
  <page-wrapper>
    <page-card header="锚点" :full="false" style="margin-bottom: 20px">
      <Anchor
        v-model="activeAnchor"
        :container="() => containerRef!"
        :anchors="anchors"
        :bounds="bounds"
        @change="anchorChangeHandler"
      />

      <div ref="containerRef" style="height: 500px; overflow: auto">
        <div id="part-1" class="ac-container" style="background-color: rgba(255, 0, 0, 0.02)">
          part-1
        </div>
        <div id="part-4" class="ac-container" style="background-color: rgba(0, 0, 255, 0.02)">
          part-4
        </div>
        <div id="part-5" class="ac-container" style="background-color: rgba(0, 0, 255, 0.02)">
          part-5
        </div>
        <div id="part-2" class="ac-container" style="background-color: rgba(0, 255, 0, 0.02)">
          part-2
        </div>
        <div id="part-3" class="ac-container" style="background-color: rgba(0, 0, 255, 0.02)">
          part-3
        </div>
      </div>
    </page-card>
    <page-card :full="false" :header="'horizontal 模式<'">
      <Anchor
        :container="() => container2Ref!"
        :anchors="horizontalAnchors"
        direction="horizontal"
      />

      <div ref="container2Ref" style="height: 500px; overflow: auto">
        <div
          v-for="(item, index) in horizontalAnchors"
          :id="item.link"
          :key="index"
          class="ac-container"
          style="background-color: rgba(255, 0, 0, 0.02)"
        >
          {{ item.title }}
        </div>
      </div>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
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

console.log('Anchor', Anchor)
</script>
<style lang="scss" scoped>
.ac-container {
  height: 50vh;
  border: 1px solid blue;
}
</style>
