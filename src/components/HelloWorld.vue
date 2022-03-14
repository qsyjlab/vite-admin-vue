<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 22:42:01
 * @FilePath: \vite-admin-vue\src\components\HelloWorld.vue
-->
<script setup lang="ts">
import { ElMessage } from 'element-plus'
// import('element-plus/es/components/loading/style/css')

// import 'element-plus/es/components/loading/style/css'
import { ref, reactive, onMounted } from 'vue'

// (() => {
//     import('element-plus/es/components/loading/style/css')
// })()

ElMessage.error('测试')

defineProps<{ msg: string }>()

const count = ref<number>(1)
</script>

<template>asdasd1231231</template>

<style scoped>
a {
    color: #42b983;
}

label {
    margin: 0 0.5em;
    font-weight: bold;
}

code {
    background-color: #eee;
    padding: 2px 4px;
    border-radius: 4px;
    color: #304455;
}
</style>
