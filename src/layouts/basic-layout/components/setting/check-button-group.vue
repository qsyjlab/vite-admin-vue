<template>
  <div
    :style="{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      cursor: 'pointer'
    }"
  >
    <div
      v-for="(item, index) in options"
      :key="index"
      :style="{
        marginRight: '30px',
        fontSize: '30px'
      }"
      @click="onClick(item.value)"
    >
      <el-tooltip
        effect="dark"
        :content="item.title"
        :style="{
          position: 'relative'
        }"
      >
        <div
          :style="{
            position: 'relative'
          }"
        >
          <div
            v-if="item.value == checkValue"
            :style="{
              fontSize: '20px',
              position: 'absolute',
              right: 0,
              bottom: '-4%',
              color: '#1677ff',
              zIndex: 1,
              cursor: 'pointer'
            }"
          >
            <Check />
          </div>
          <component :is="item.icon"></component>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Component } from 'vue'
import { ref } from 'vue'
import { Check } from './icon'

const emits = defineEmits<{
  (e: 'change', value: unknown): void
}>()

const props = defineProps<{
  defaultValue?: unknown
  options: {
    title: string
    value: unknown
    icon: Component
  }[]
}>()

const checkValue = ref(props.defaultValue)

const onClick = (value: unknown) => {
  checkValue.value = value
  emits('change', value)
}
</script>
