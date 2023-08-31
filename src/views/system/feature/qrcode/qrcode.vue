<template>
  <div>
    <el-card>
      <div>二维码</div>

      <Qrcode
        text="https://qsyjlab.club/"
        :logo="{
          src: 'https://api.qsyjlab.club/file/uploads/cover/20220526/628edee1a79a4.jpg',
          size: 60
        }"
        :size="300"
      />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { Qrcode } from '@/components/qrcode'
</script>
<style scoped></style>
