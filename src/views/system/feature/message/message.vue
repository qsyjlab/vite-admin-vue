<template>
  <page-wrapper>
    <page-card style="margin-bottom: 20px" header="message" :full="false">
      <el-space>
        <el-button :plain="true" @click="message.success('success')">success</el-button>
        <el-button :plain="true" @click="message.warning('warning')">warning</el-button>
        <el-button :plain="true" @click="message.info('info')">info</el-button>
        <el-button :plain="true" @click="message.error('error')">error</el-button>
      </el-space>
    </page-card>
    <page-card style="margin-bottom: 20px" header="notification" :full="false">
      <el-space>
        <el-button :plain="true" @click="notification.success('success')">success</el-button>
        <el-button :plain="true" @click="notification.warning('warning')">warning</el-button>
        <el-button :plain="true" @click="notification.info('info')">info</el-button>
        <el-button :plain="true" @click="notification.error('error')">error</el-button>
      </el-space>
    </page-card>

    <page-card header="messageBox" :full="false">
      <el-space>
        <el-button :plain="true" @click="showMesasgeBoxAlert">alert</el-button>
      </el-space>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { useMessage } from '@/hooks'

const { message, notification, messageBox } = useMessage()

const showMesasgeBoxAlert = () => {
  messageBox.alert('This is a message', 'Title', {
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      message({
        type: 'info',
        message: `action: ${action}`
      })
    }
  })
}
</script>
<style scoped></style>
