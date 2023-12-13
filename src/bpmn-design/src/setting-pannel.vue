<template>
  <div class="setting">
    {{ getRawType(selectedElement?.type) }}
    {{ customTranslate(getRawType(selectedElement?.type)) }}
  </div>
</template>
<script setup lang="ts">
import { useBpmnContext } from './bpmn'
import { customTranslate } from './lang'
import { getRawType } from './utils'

const { selectedElement } = useBpmnContext()
</script>
<style scoped>
.setting {
  height: 100%;
}
</style>
