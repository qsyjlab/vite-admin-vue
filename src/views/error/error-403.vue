<template>
  <div class="not-found-page">
    <div class="not-found-main">
      <div class="icon">
        <img src="~@/assets/svg/403.svg" alt="/" />
      </div>
      <div class="desc">对不起，您没有访问该资源的权限</div>
    </div>
    <div class="not-found-footer">
      <el-button type="primary" @click="$router.back()">返回</el-button>
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
  background-color: white;
}

.icon {
  width: 90px;
  height: 90px;
  margin-bottom: 20px;
}

.desc {
  font-size: 14px;
}

.not-found-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>
