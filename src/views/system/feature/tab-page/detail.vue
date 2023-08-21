<template>
  <div>
    <el-card>
      <pre>
            {{ $route.params }}
        </pre
      >
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTabs } from '@/hooks'

const { setTitle } = useTabs()
const route = useRoute()

setTitle(`新标签页面${route.params.id}`)
</script>
<style scoped></style>
