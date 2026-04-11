<template>
  <page-wrapper>
    <page-card header="KeepAlive 示例 A" style="margin-bottom: 16px">
      <el-alert
        title="在 A 页面输入内容后跳到 B，再返回 A，若内容保留说明缓存正常。"
        type="success"
        :closable="false"
      />
    </page-card>

    <page-card header="缓存状态">
      <el-form label-width="100px">
        <el-form-item label="输入内容">
          <el-input v-model="draft" placeholder="输入任意内容后切到 KeepAlive B" />
        </el-form-item>
        <el-form-item label="计数器">
          <el-space>
            <el-button type="primary" @click="count += 1">+1</el-button>
            <el-tag>{{ count }}</el-tag>
          </el-space>
        </el-form-item>
      </el-form>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const draft = ref('')
const count = ref(0)
</script>
