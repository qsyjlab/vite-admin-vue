<template>
  <page-wrapper class="message-page">
    <!-- 渐变标题区 -->
    <header class="message-page__header">
      <div class="message-page__title">
        <div class="message-page__title-icon">
          <ChatLineRound />
        </div>
        <div>
          <h1>消息提示</h1>
          <p>
            基于 Element Plus 的全局反馈能力，覆盖 Message、Notification 与 MessageBox
            三类交互场景。
          </p>
        </div>
      </div>
      <div class="message-page__capabilities">
        <el-tag effect="plain" type="primary">即时反馈</el-tag>
        <el-tag effect="plain" type="success">多类型</el-tag>
        <el-tag effect="plain" type="warning">可关闭</el-tag>
        <el-tag effect="plain" type="info">模态交互</el-tag>
      </div>
    </header>

    <!-- 三栏卡片网格 -->
    <div class="message-page__grid">
      <!-- Message 消息提示卡片 -->
      <section class="msg-card">
        <h3 class="msg-card__title">
          <ChatDotRound />
          <span>Message 消息提示</span>
        </h3>
        <p class="msg-card__desc">轻量级顶部反馈，适用于操作的即时提示。</p>
        <el-space direction="vertical" :fill="true" :size="12" class="msg-card__actions">
          <div class="msg-card__row">
            <el-button plain type="success" @click="message.success('操作成功')">success</el-button>
            <el-button plain type="warning" @click="message.warning('请注意风险')"
              >warning</el-button
            >
            <el-button plain type="info" @click="message.info('这是一条信息')">info</el-button>
            <el-button plain type="danger" @click="message.error('操作失败')">error</el-button>
          </div>
          <el-button plain @click="showCloseableMessage">带关闭按钮</el-button>
          <el-button plain @click="showHtmlMessage">HTML 内容</el-button>
        </el-space>
      </section>

      <!-- Notification 通知卡片 -->
      <section class="msg-card">
        <h3 class="msg-card__title">
          <Bell />
          <span>Notification 通知</span>
        </h3>
        <p class="msg-card__desc">右上角悬浮通知，可承载标题与正文内容。</p>
        <el-space direction="vertical" :fill="true" :size="12" class="msg-card__actions">
          <div class="msg-card__row">
            <el-button plain type="success" @click="notification.success('success')"
              >success</el-button
            >
            <el-button plain type="warning" @click="notification.warning('warning')"
              >warning</el-button
            >
            <el-button plain type="info" @click="notification.info('info')">info</el-button>
            <el-button plain type="danger" @click="notification.error('error')">error</el-button>
          </div>
          <el-button plain @click="showTitleNotification">带标题和内容</el-button>
          <el-button plain @click="showPositionNotification">设置位置 (bottom-right)</el-button>
        </el-space>
      </section>

      <!-- MessageBox 弹框卡片 -->
      <section class="msg-card">
        <h3 class="msg-card__title">
          <Warning />
          <span>MessageBox 弹框</span>
        </h3>
        <p class="msg-card__desc">模态对话框，适用于确认与输入等交互场景。</p>
        <el-space direction="vertical" :fill="true" :size="12" class="msg-card__actions">
          <div class="msg-card__row">
            <el-button plain type="success" @click="showAlert('success')">alert success</el-button>
            <el-button plain type="warning" @click="showAlert('warning')">alert warning</el-button>
          </div>
          <el-button plain @click="showConfirm">confirm 确认</el-button>
          <el-button plain @click="showPrompt">prompt 输入</el-button>
        </el-space>
      </section>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { Bell, ChatDotRound, Warning, ChatLineRound } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { useMessage } from '@/hooks'

defineOptions({ name: 'MessagePage' })

const { message, notification, messageBox } = useMessage()

// 带关闭按钮的 Message
const showCloseableMessage = () => {
  message({
    type: 'success',
    message: '这是一条可手动关闭的消息',
    showClose: true,
    duration: 0
  })
}

// 包含 HTML 内容的 Message
const showHtmlMessage = () => {
  message({
    type: 'info',
    message: '<strong>加粗</strong> 的 <i>HTML</i> 内容',
    dangerouslyUseHTMLString: true
  })
}

// 带标题和正文的 Notification
const showTitleNotification = () => {
  notification({
    title: '系统通知',
    message: '这是一条带有标题和正文内容的通知',
    type: 'success'
  })
}

// 自定义弹出位置的 Notification
const showPositionNotification = () => {
  notification({
    title: '位置通知',
    message: '出现在右下角的通知',
    type: 'info',
    position: 'bottom-right'
  })
}

// MessageBox alert，支持不同 type
const showAlert = (type: 'success' | 'warning') => {
  messageBox.alert('这是一条 Alert 弹框内容', '提示', {
    confirmButtonText: '确定',
    type
  })
}

// MessageBox confirm 确认框
const showConfirm = () => {
  messageBox
    .confirm('确认执行此操作吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      message.success('已确认')
    })
    .catch(() => {
      message.info('已取消')
    })
}

// MessageBox prompt 输入框
const showPrompt = () => {
  messageBox
    .prompt('请输入您的邮箱', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+@[\w]+(?:\.[\w]+)+/,
      inputErrorMessage: '邮箱格式不正确'
    })
    .then(({ value }) => {
      message.success(`输入内容：${value}`)
    })
    .catch(() => {
      message.info('已取消')
    })
}
</script>

<style scoped lang="scss">
.message-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  // 渐变标题区
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-success-light-9)
    );
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;

    h1 {
      margin: 0;
      font-size: 22px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__title-icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-layout-radius);
    background: linear-gradient(135deg, #409eff, #67c23a);
    color: #fff;
    box-shadow: 0 6px 16px var(--global-shadow-color);

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__capabilities {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    flex: none;
  }

  // 三栏卡片网格
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }
}

// 单张卡片
.msg-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 15px;
    color: var(--el-text-color-primary);

    svg {
      width: 16px;
      height: 16px;
      color: var(--el-color-primary);
    }
  }

  &__desc {
    margin: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__actions {
    width: 100%;
  }

  // 按钮行，支持换行
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }
}

// 响应式：760px 以下变为单列
@media (max-width: 760px) {
  .message-page__grid {
    grid-template-columns: 1fr;
  }

  .message-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .message-page__capabilities {
    justify-content: flex-start;
  }
}
</style>
