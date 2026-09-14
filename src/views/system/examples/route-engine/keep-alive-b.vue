<template>
  <page-wrapper class="keep-alive-b-page">
    <g-page-header
      title="缓存验证"
      description="这个页面从菜单隐藏，只用于验证 A/B 页面切换后的缓存表现：输入内容后返回缓存示例，再切回来，检查两个页面的本地状态是否都保留。"
      :icon="Coin"
    >
      <template #actions>
        <el-button type="primary" plain @click="goBack">返回缓存示例</el-button>
      </template>
    </g-page-header>

    <pro-card title="验证页状态">
      <el-form label-width="120px" class="state-form">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="切回缓存示例后再返回，检查是否保留" />
        </el-form-item>
        <el-form-item label="当前开关">
          <el-switch v-model="enabled" />
        </el-form-item>
        <el-form-item label="状态说明">
          <div class="status-strip">
            <span>keyword: {{ keyword || '未输入' }}</span>
            <span>enabled: {{ enabled ? '开启' : '关闭' }}</span>
          </div>
        </el-form-item>
      </el-form>
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { Coin } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GPageHeader, PageWrapper } from '@/components'

const router = useRouter()
const keyword = ref('')
const enabled = ref(true)

const goBack = () => {
  router.push({ name: 'RouteEngineKeepAliveA' })
}
</script>

<style lang="scss" scoped>
.keep-alive-b-page {
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
