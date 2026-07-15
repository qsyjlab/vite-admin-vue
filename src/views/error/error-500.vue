<template>
  <main class="error-page">
    <pro-result
      status="500"
      title="服务暂时不可用"
      sub-title="系统处理请求时发生异常，你可以稍后重试或返回工作台。"
      primary-text="重新加载"
      secondary-text="返回工作台"
      @primary="reload"
      @secondary="router.push('/welcome')"
    />
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ProResult } from '@framebase/element-plus-pro-components'

defineOptions({ name: 'Error500Page' })

const router = useRouter()

function reload() {
  window.location.reload()
}
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
