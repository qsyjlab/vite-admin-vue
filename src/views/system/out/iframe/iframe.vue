<template>
  <div style="height: 100%">
    <IframePage :frame-src="config.docxLink"></IframePage>
  </div>
</template>

<script setup lang="ts">
import { IframePage } from '@/components'
import config from '@/config'
</script>
