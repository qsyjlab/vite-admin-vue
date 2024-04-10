<template>
  <slot></slot>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import { proConfigProviderContextKey } from './token'
import type { ProConfigProviderProps } from './types'
import { readonly } from 'vue'

defineOptions({
  name: 'ProConfigProvider'
})

const props = defineProps<Partial<ProConfigProviderProps>>()

provide(proConfigProviderContextKey, readonly(props))
</script>
