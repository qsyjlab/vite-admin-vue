<template>
  <page-wrapper>
    <page-card header="缓存状态示例" style="margin-bottom: 16px">
      <div class="keep-head">
        <div>
          <p class="keep-title">在当前页输入内容后切到验证页，再返回当前页观察状态是否保留。</p>
          <p class="keep-desc">
            这个示例用于检查业务页 keep-alive name、tabs 缓存和动态路由注册是否配合正常。
          </p>
        </div>
        <el-button type="primary" @click="goVerify">切到验证页</el-button>
      </div>
    </page-card>

    <page-card header="当前页状态">
      <el-form label-width="100px" class="state-form">
        <el-form-item label="输入内容">
          <el-input v-model="draft" placeholder="输入任意内容后切到验证页" />
        </el-form-item>
        <el-form-item label="计数器">
          <el-space>
            <el-button type="primary" @click="count += 1">+1</el-button>
            <el-button @click="count = 0">重置</el-button>
            <el-tag>{{ count }}</el-tag>
          </el-space>
        </el-form-item>
        <el-form-item label="状态说明">
          <div class="status-strip">
            <span>draft: {{ draft || '未输入' }}</span>
            <span>count: {{ count }}</span>
          </div>
        </el-form-item>
      </el-form>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const draft = ref('')
const count = ref(0)

const goVerify = () => {
  router.push({ name: 'RouteEngineKeepAliveB' })
}

onActivated(() => {
  console.log('keep-alive-a activated')
})
</script>

<style lang="scss" scoped>
.keep-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.keep-title {
  margin: 0;
  color: var(--global-heading-color);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
}

.keep-desc {
  margin: 8px 0 0;
  color: var(--global-text-color-secondary);
  line-height: 1.7;
}

.state-form {
  max-width: 720px;
}

.status-strip {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    border: 1px solid var(--global-border-color);
    border-radius: 6px;
    padding: 4px 10px;
    background: var(--global-surface-color-muted);
    color: var(--global-text-color-secondary);
  }
}
</style>
