<template>
  <span
    class="icon-selector"
    :style="{
      width: `${size}px`
    }"
  >
    <Icon v-if="iconType === 'ify'" :icon="iconName" :color="color" :width="size" :height="size" />
  </span>
</template>
<script lang="ts">
export default { name: 'IconSelector' }
</script>
<script setup lang="ts">
import { watch, ref } from 'vue'
import { Icon, disableCache } from '@iconify/vue'

disableCache('all')

const props = withDefaults(
  defineProps<{
    icon?: string
    size?: number
    color?: string
  }>(),
  {
    size: 24
  }
)

const iconType = ref('')
const iconName = ref('')

watch(
  () => ref(props),
  () => {
    const nSplit = props.icon?.split('.')
    iconType.value = nSplit?.[0] || ''
    iconName.value = nSplit?.[1] || ''
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.icon-selector {
  display: inline-block;
  > * {
    vertical-align: middle;
  }
}
</style>
