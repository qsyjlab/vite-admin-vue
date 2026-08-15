<template>
  <main class="error-page">
    <pro-result
      status="404"
      title="页面不存在"
      sub-title="你访问的地址可能已失效，或者页面已经被移动。"
      primary-text="返回工作台"
      secondary-text="返回上一页"
      @primary="router.push('/welcome')"
      @secondary="router.back()"
    />
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ProResult } from '@framebase/element-plus-pro-components'

defineOptions({ name: 'Error404Page' })

const router = useRouter()
</script>

<style scoped>
.error-page {
  display: flex;
  width: 100%;
  min-height: 100%;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  background: var(--global-bg-color-2);
}

:global(#app > .error-page) {
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
