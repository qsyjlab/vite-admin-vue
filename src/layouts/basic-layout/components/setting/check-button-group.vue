<template>
  <div class="check-button-group">
    <div v-for="(item, index) in options" :key="index" class="check-button-group__item">
      <el-tooltip effect="dark" :content="item.title">
        <div
          :class="['check-button-group__card', item.value === checkValue ? 'is-active' : '']"
          @click="onClick(item.value)"
        >
          <div v-if="item.value == checkValue" class="check-button-group__checked">
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
import { Check } from './icon'

interface IProps {
  modelValue?: unknown
  options: {
    title: string
    value: unknown
    icon: Component
  }[]
}

interface IEmits {
  (e: 'change', value: unknown): void
}

const emits = defineEmits<IEmits>()

defineProps<IProps>()

const checkValue = defineModel<unknown>('modelValue')

const onClick = (value: unknown) => {
  checkValue.value = value
  emits('change', value)
}
</script>

<style lang="scss" scoped>
.check-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 22px;

  &__item {
    flex: 0 0 auto;
  }

  &__card {
    position: relative;
    cursor: pointer;
    transition: transform 0.18s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  &__checked {
    position: absolute;
    right: 6px;
    top: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #1677ff;
    color: #fff;
    z-index: 2;
    font-size: 12px;
    box-shadow: 0 6px 14px rgba(22, 119, 255, 0.22);
  }
}
</style>
