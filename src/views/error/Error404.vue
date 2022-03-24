<!--
 * @Description: 404
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 15:59:51
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-24 22:24:21
 * @FilePath: \vite-admin-vue\src\views\error\Error404.vue
-->

<template>
  <div class="not-found-page">
    <div class="not-found-main">
      <img src="~@/assets/svg/404.svg" alt="/" />
    </div>
    <div class="not-found-footer">
      <el-link @click="$router.back()">返回上一页</el-link>
    </div>
  </div>
</template>
<style scoped>
.not-found-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.not-found-main {
  margin-bottom: 30px;
}
</style>
