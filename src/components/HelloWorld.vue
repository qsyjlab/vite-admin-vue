<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 14:21:23
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

onMounted(() => {
    import('element-plus/es/components/loading/style/css')
})
ElMessage.error('测试')

defineProps<{ msg: string }>()

const count = ref<number>(1)
</script>

<template>
    <h1>{{ msg }}</h1>

    <p v-loading="true">
        <el-button>测试</el-button>
        <ElButton>测试</ElButton>
        <el-checkbox v label="Option 1" size="large"></el-checkbox>
        <!-- <el-button>测试</el-button> -->
        Recommended IDE setup:
        <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
        +
        <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    </p>

    <p>See <code>README.md</code> for more information.</p>

    <p>
        <a href="https://vitejs.dev/guide/features.html" target="_blank"> Vite Docs </a>
        |
        <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
    </p>

    <button type="button" @click="count++">count is: {{ count }}</button>
    <p>
        Edit
        <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>
</template>

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
