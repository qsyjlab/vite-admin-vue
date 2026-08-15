<template>
  <main class="error-page">
    <pro-result
      status="403"
      title="暂无访问权限"
      sub-title="当前账号没有访问此资源的权限，请联系管理员授权。"
      primary-text="返回上一页"
      secondary-text="返回工作台"
      @primary="router.back()"
      @secondary="router.push('/welcome')"
    />
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ProResult } from '@framebase/element-plus-pro-components'

defineOptions({ name: 'Error403Page' })

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
