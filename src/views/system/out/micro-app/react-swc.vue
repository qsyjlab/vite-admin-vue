<template>
  <div></div>
</template>

<script setup lang="ts">
import { loadMicroApp, type MicroApp } from 'qiankun'
import { onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'ReactSwc'
})

// let subAppInstance: Nullable<MicroApp> = null

// onMounted(mountSubApp)
// onUnmounted(unmountSubApp)

function mountSubApp() {
  //   if (!subAppInstance) {
  //     subAppInstance = loadMicroApp({
  //       name: 'react-swc',
  //       entry: 'http://localhost:5301',
  //       container: '#react-swc',
  //       props: {
  //         // 你可传给子应用的参数，比如路由上下文、全局状态接口等
  //       }
  //       // optional: fetch, sandbox, etc.
  //     })
  //   }
}

function unmountSubApp() {
  //   if (subAppInstance) {
  //     subAppInstance.unmount()
  //     subAppInstance = null
  //   }
}
</script>
