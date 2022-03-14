<!--
 * @Description: 默认模板
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:59:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 23:19:35
 * @FilePath: \vite-admin-vue\src\layouts\BasicLayout\BasicLayout.vue
-->
<template>
    <el-config-provider :locale="zhCn">
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>
                    <span class="test">asdasd</span>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<style lang="scss" scoped>
.test {
    color: red;
}
</style>
