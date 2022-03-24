<!--
 * @Description: 403
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 16:00:05
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-24 22:23:16
 * @FilePath: \vite-admin-vue\src\views\error\Error403.vue
-->

<template>
  <div class="not-found-page">
    <div class="not-found-main">
      <img src="~@/assets/svg/403.svg" alt="/" />
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
