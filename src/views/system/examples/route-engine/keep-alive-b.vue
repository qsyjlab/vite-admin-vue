<template>
  <page-wrapper>
    <page-card header="KeepAlive 示例 B" style="margin-bottom: 16px">
      <el-alert
        title="这个页面用于和 A 来回切换，观察两个页面的本地状态是否都被保留。"
        type="info"
        :closable="false"
      />
    </page-card>

    <page-card header="缓存状态">
      <el-form label-width="120px">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="切换回 A 后再返回，检查是否保留" />
        </el-form-item>
        <el-form-item label="当前开关">
          <el-switch v-model="enabled" />
        </el-form-item>
      </el-form>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const enabled = ref(true)
</script>
