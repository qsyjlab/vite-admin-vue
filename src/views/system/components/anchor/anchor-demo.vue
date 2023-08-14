<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <div>锚点</div>

      <Anchor :container="() => containerRef!" :anchors="anchors" />

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
      <!--

      <div id="part-2" style={{ height: '100vh', background: 'rgba(0,255,0,0.02)' }} />
      <div id="part-3" style={{ height: '100vh', background: 'rgba(0,0,255,0.02)' }} /> -->
    </el-card>
    <el-card>
      <div>horizontal 模式</div>

      <Anchor
        :container="() => container2Ref!"
        :anchors="horizontalAnchors"
        direction="horizontal"
      />

      <div ref="container2Ref" style="height: 500px; overflow: auto">
        <div
          v-for="(item, index) in horizontalAnchors"
          :id="item.link"
          class="ac-container"
          style="background-color: rgba(255, 0, 0, 0.02)"
          :key="index"
        >
          {{ item.title }}
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Anchor } from '@/components/anchor'

const containerRef = ref<HTMLElement>()
const container2Ref = ref<HTMLElement>()

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

console.log('Anchor', Anchor)
</script>
<style lang="scss" scoped>
.ac-container {
  height: 50vh;
  border: 1px solid blue;
}
</style>
