<!--
 * @Description: 配置注入
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 11:18:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 11:19:16
 * @FilePath: \vite-admin-vue\src\layouts\LayoutPackage\components\LayoutConfigProvider.vue
-->

<template>
  <el-config-provider :locale="zhCn">
    <slot />
  </el-config-provider>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>
