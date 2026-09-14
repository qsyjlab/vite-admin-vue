<template>
  <page-wrapper class="keep-alive-a-page">
    <g-page-header
      title="缓存示例"
      description="在当前页输入内容后切到验证页，再返回当前页观察状态是否保留，用于检查 keep-alive、tabs 缓存与动态路由注册是否配合正常。"
      :icon="Coin"
    >
      <template #actions>
        <el-button type="primary" @click="goVerify">切到验证页</el-button>
      </template>
    </g-page-header>

    <pro-card title="当前页状态">
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
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { Coin } from '@element-plus/icons-vue'
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GPageHeader, PageWrapper } from '@/components'

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
.keep-alive-a-page {
  gap: 16px;
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
