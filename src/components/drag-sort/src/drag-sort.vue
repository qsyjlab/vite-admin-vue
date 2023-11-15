<template>
  <div class="drag-sort">
    <transition-group name="drag" class="list" tag="ul">
      <li
        v-for="(item, index) in list"
        :key="item.label"
        :draggable="true"
        class="list-item"
        @dragenter="dragenter($event, index)"
        @dragover="dragover($event)"
        @dragstart="dragstart(index)"
      >
        {{ item.label }}
      </li>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const dragIndex = ref()

const list = ref([
  { label: '列表1' },
  { label: '列表2' },
  { label: '列表3' },
  { label: '列表4' },
  { label: '列表5' },
  { label: '列表6' }
])
const dragstart = (index: number) => {
  dragIndex.value = index
}
const dragenter = (e: DragEvent, index: number) => {
  console.log('index', index)

  e.preventDefault()
  if (dragIndex.value !== index) {
    const moving = list.value[dragIndex.value]
    list.value.splice(dragIndex.value, 1)
    list.value.splice(index, 0, moving)
    dragIndex.value = index
  }
}
const dragover = (e: DragEvent) => {
  e.preventDefault()
}
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
  .drag-move {
    transition: transform 0.3s;
  }
  .list-item {
    cursor: move;
    width: 300px;
    background: #ea6e59;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 6px;
    // height: 50px;
    line-height: 50px;
    text-align: center;
  }
}
</style>
