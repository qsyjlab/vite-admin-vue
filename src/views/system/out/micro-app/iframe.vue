<template>
  <div style="height: 100%">
    <IframePage :frame-src="src"></IframePage>
    asdasd
  </div>
</template>

<script setup lang="ts">
import { IframePage } from '@/components'
// import config from '@/config'
const src = 'http://localhost:5173/#/patrol/cruising/patrolRoundDetails?id=151'
</script>
