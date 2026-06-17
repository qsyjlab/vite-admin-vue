<template>
  <page-wrapper>
    <page-card header="缓存验证页" style="margin-bottom: 16px">
      <div class="verify-head">
        <div>
          <p class="verify-title">这个页面从菜单隐藏，只用于验证 A/B 页面切换后的缓存表现。</p>
          <p class="verify-desc">
            输入内容后返回缓存示例，再切回来，检查两个页面的本地状态是否都保留。
          </p>
        </div>
        <el-button type="primary" plain @click="goBack">返回缓存示例</el-button>
      </div>
    </page-card>

    <page-card header="验证页状态">
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
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')
const enabled = ref(true)

const goBack = () => {
  router.push({ name: 'RouteEngineKeepAliveA' })
}
</script>

<style lang="scss" scoped>
.verify-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.verify-title {
  margin: 0;
  color: var(--global-heading-color);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
}

.verify-desc {
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
    border: 1px solid #dbe3ef;
    border-radius: 6px;
    padding: 4px 10px;
    background: #f8fafc;
    color: var(--global-text-color-secondary);
  }
}
</style>
