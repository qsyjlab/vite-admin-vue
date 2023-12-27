<template>
  <div class="not-found-page">
    <div class="not-found-main">
      <div class="icon">
        <img src="~@/assets/svg/404.svg" alt="/" />
      </div>
      <div class="desc">抱歉，页面不见了～</div>
    </div>
    <div class="not-found-footer">
      <el-space>
        <el-button text bg @click="retry">重试</el-button>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const retry = () => {
  router.replace({
    name: route.name as string,
    params: route.params,
    query: route.query
  })
}
</script>
<style scoped>
.not-found-page {
  height: 100%;
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
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
