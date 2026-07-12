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
  display: flex;
  width: 100%;
  min-height: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--global-bg-color-2);
}

:global(#app > .not-found-page) {
  min-height: 100vh;
  min-height: 100dvh;
}

.icon {
  width: 90px;
  height: 90px;
  margin-bottom: 20px;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
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
