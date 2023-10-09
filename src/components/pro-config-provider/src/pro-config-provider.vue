<template>
  <slot></slot>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import { proConfigProviderContextKey } from './token'
import type { ProConfigProviderProps } from './types'
import { shallowReadonly } from 'vue'

defineOptions({
  name: 'ProConfigProvider'
})

const props = defineProps<ProConfigProviderProps>()

provide(proConfigProviderContextKey, shallowReadonly(props))
</script>
