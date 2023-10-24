<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <Qrcode
        text="https://qsyjlab.club/"
        :logo="{
          src: 'https://api.qsyjlab.club/file/uploads/cover/20220526/628edee1a79a4.jpg',
          size: 60
        }"
        :size="300"
      />
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Qrcode } from '@/components/qrcode'
</script>
<style scoped></style>
