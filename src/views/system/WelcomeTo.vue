<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:09:49
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 10:51:10
 * @FilePath: \vite-admin-vue\src\views\system\WelcomeTo.vue
-->

<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-button v-hasAuth="'asdasd'" type="primary">asdas</el-button>
    <el-button v-hasAuth="'asdasd'" type="danger">asdas</el-button>
    <el-button type="danger">asdas</el-button>
  </el-card>
</template>
