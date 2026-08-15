<template>
  <page-wrapper class="qrcode-page">
    <header class="qrcode-page__header">
      <div class="qrcode-page__title">
        <div class="qrcode-page__title-icon">
          <Grid />
        </div>
        <div>
          <h1>二维码生成</h1>
          <p>基于 Canvas 渲染，支持自定义尺寸、纠错级别与 Logo 水印。</p>
        </div>
      </div>
      <div class="qrcode-page__capabilities">
        <el-tag effect="plain" type="primary">Canvas 渲染</el-tag>
        <el-tag effect="plain" type="success">Logo 水印</el-tag>
        <el-tag effect="plain" type="warning">纠错级别</el-tag>
      </div>
    </header>

    <div class="qrcode-page__main">
      <section class="qrcode-stage">
        <div class="qrcode-stage__canvas">
          <Qrcode
            :text="formState.text || '请输入内容'"
            :size="formState.size"
            :error-level="formState.errorLevel"
            :margin="formState.margin"
            :logo="
              formState.logoSrc ? { src: formState.logoSrc, size: formState.logoSize } : undefined
            "
          />
        </div>
        <div class="qrcode-stage__meta">
          <span class="qrcode-stage__label">当前内容</span>
          <code class="qrcode-stage__content">{{ formState.text || '（空）' }}</code>
        </div>
      </section>

      <aside class="qrcode-aside">
        <div class="aside-card">
          <h3 class="aside-card__title">
            <Setting />
            <span>基础配置</span>
          </h3>
          <el-form label-position="top" class="aside-form">
            <el-form-item label="二维码内容">
              <el-input
                v-model="formState.text"
                type="textarea"
                :rows="3"
                placeholder="输入网址或文本"
              />
            </el-form-item>
            <el-form-item label="尺寸 (px)">
              <el-slider v-model="formState.size" :min="120" :max="400" :step="10" show-input />
            </el-form-item>
            <el-form-item label="纠错级别">
              <el-radio-group v-model="formState.errorLevel" size="small">
                <el-radio-button value="L">L (7%)</el-radio-button>
                <el-radio-button value="M">M (15%)</el-radio-button>
                <el-radio-button value="Q">Q (25%)</el-radio-button>
                <el-radio-button value="H">H (30%)</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="边距">
              <el-slider v-model="formState.margin" :min="0" :max="20" show-input />
            </el-form-item>
          </el-form>
        </div>

        <div class="aside-card">
          <h3 class="aside-card__title">
            <Picture />
            <span>Logo 水印</span>
          </h3>
          <el-form label-position="top" class="aside-form">
            <el-form-item label="Logo 地址">
              <el-input v-model="formState.logoSrc" placeholder="留空则不显示 Logo" clearable />
            </el-form-item>
            <el-form-item label="Logo 尺寸 (px)">
              <el-slider v-model="formState.logoSize" :min="20" :max="120" :step="5" show-input />
            </el-form-item>
          </el-form>
        </div>

        <div class="aside-card aside-card--highlight">
          <h3 class="aside-card__title">
            <InfoFilled />
            <span>使用说明</span>
          </h3>
          <ul class="usage-list">
            <li><b>text</b> 必填，支持任意文本或 URL</li>
            <li><b>size</b> 控制画布像素尺寸</li>
            <li><b>errorLevel</b> 越高容错越好，图案越密</li>
            <li><b>logo</b> 传入对象可同时配置 src 与 size</li>
          </ul>
        </div>
      </aside>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Grid, InfoFilled, Picture, Setting } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { Qrcode } from '@/components/qrcode'

defineOptions({ name: 'QrcodePage' })

const formState = reactive({
  text: 'https://qsyjlab.club/',
  size: 260,
  errorLevel: 'M' as 'L' | 'M' | 'Q' | 'H',
  margin: 4,
  logoSrc: 'https://api.qsyjlab.club/file/uploads/cover/20220526/628edee1a79a4.jpg',
  logoSize: 60
})
</script>

<style scoped lang="scss">
.qrcode-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-warning-light-9)
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
    background: linear-gradient(135deg, #409eff, #1677ff);
    color: #fff;
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.32);

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

  &__main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 16px;
    align-items: start;
  }
}

.qrcode-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);
  min-height: 480px;

  &__canvas {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: var(--global-layout-radius);
    background: var(--el-fill-color-light);
    box-shadow: 0 8px 24px var(--global-shadow-color);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    max-width: 100%;
  }

  &__label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__content {
    max-width: 400px;
    padding: 6px 12px;
    border-radius: var(--global-control-radius);
    background: var(--el-fill-color-darker, #f5f5f5);
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 12px;
    color: var(--el-text-color-regular);
    word-break: break-all;
    text-align: center;
  }
}

.qrcode-aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.aside-card {
  padding: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    font-size: 15px;
    color: var(--el-text-color-primary);

    svg {
      width: 16px;
      height: 16px;
      color: var(--el-color-primary);
    }
  }

  &--highlight {
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-fill-color-light)
    );
    border-color: var(--el-color-primary-light-5);
  }
}

.aside-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    padding-bottom: 4px;
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
}

.usage-list {
  margin: 0;
  padding-left: 18px;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 1.9;

  b {
    color: var(--el-color-primary);
    font-weight: 600;
  }
}

@media (max-width: 1100px) {
  .qrcode-page__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .qrcode-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .qrcode-page__capabilities {
    justify-content: flex-start;
  }
}
</style>
