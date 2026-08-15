<template>
  <page-wrapper class="download-page">
    <!-- 渐变标题区 -->
    <header class="download-page__header">
      <div class="download-page__title">
        <div class="download-page__title-icon">
          <Download />
        </div>
        <div>
          <h1>文件下载</h1>
          <p>封装多种下载方式，覆盖 Blob 流、远程地址转 Blob 与请求拦截器三类常见场景。</p>
        </div>
      </div>
      <div class="download-page__capabilities">
        <el-tag effect="plain" type="primary">流下载</el-tag>
        <el-tag effect="plain" type="success">地址下载</el-tag>
        <el-tag effect="plain" type="warning">请求拦截</el-tag>
      </div>
    </header>

    <!-- 三张方法卡片网格 -->
    <div class="download-page__grid">
      <!-- 卡片1: Blob 流下载 -->
      <section class="dl-card">
        <div class="dl-card__icon dl-card__icon--primary">
          <Document />
        </div>
        <h3 class="dl-card__title">Blob 流下载</h3>
        <p class="dl-card__desc">
          将内存中的 Blob 对象直接下载为文件，适用于前端生成内容的即时导出。
        </p>
        <el-button type="primary" plain class="dl-card__btn" @click="downloadBlob"
          >下载文本文件</el-button
        >
      </section>

      <!-- 卡片2: URL 地址转 Blob -->
      <section class="dl-card">
        <div class="dl-card__icon dl-card__icon--success">
          <Picture />
        </div>
        <h3 class="dl-card__title">URL 地址转 Blob</h3>
        <p class="dl-card__desc">
          从远程地址获取文件并转 Blob 下载，适用于跨域资源或远程图片保存。
        </p>
        <el-button type="success" plain class="dl-card__btn" @click="downloadUrl"
          >下载示例图片</el-button
        >
      </section>

      <!-- 卡片3: 请求拦截器 -->
      <section class="dl-card">
        <div class="dl-card__icon dl-card__icon--warning">
          <Link />
        </div>
        <h3 class="dl-card__title">请求拦截器</h3>
        <p class="dl-card__desc">
          通过 axios responseType: blob 拦截器自动下载，适用于需要鉴权头的接口。
        </p>
        <el-button type="warning" plain class="dl-card__btn" @click="downloadByRequest"
          >发起请求下载</el-button
        >
      </section>
    </div>

    <!-- 底部说明卡片 -->
    <section class="dl-tips">
      <h3 class="dl-tips__title">
        <InfoFilled />
        <span>使用场景与注意事项</span>
      </h3>
      <div class="dl-tips__content">
        <div class="dl-tips__group">
          <h4 class="dl-tips__group-title">使用场景</h4>
          <ul class="dl-tips__list">
            <li><b>Blob 流下载</b>：前端动态生成的文本、JSON、CSV 等内容导出。</li>
            <li><b>URL 地址转 Blob</b>：跨域图片、静态资源文件的本地保存。</li>
            <li><b>请求拦截器</b>：需要携带 Token 或自定义请求头的接口文件下载。</li>
          </ul>
        </div>
        <div class="dl-tips__group">
          <h4 class="dl-tips__group-title">注意事项</h4>
          <ul class="dl-tips__list">
            <li>跨域资源需服务端正确配置 CORS 响应头，否则 fetch 将失败。</li>
            <li>大文件流下载会占用浏览器内存，建议结合分片或流式处理。</li>
            <li>URL.createObjectURL 生成的临时链接应及时通过 URL.revokeObjectURL 释放。</li>
          </ul>
        </div>
      </div>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Download, Document, Picture, Link, InfoFilled } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { downloadFileStream, convertUnknownObjectToBlob } from '@/utils'
import { requestBlob } from '@/api/file'

defineOptions({ name: 'DownloadPage' })

// 方式一：Blob 流下载，将内存中的 Blob 直接下载为文件
const downloadBlob = () => {
  try {
    downloadFileStream(new Blob(['这是一段通过 Blob 流下载的文本内容。']))
    ElMessage.success('文本文件下载成功')
  } catch {
    ElMessage.error('文本文件下载失败')
  }
}

// 方式二：URL 地址转 Blob，从远程地址获取后下载
const downloadUrl = async () => {
  try {
    const blob = await convertUnknownObjectToBlob(
      'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
    )
    if (blob) {
      downloadFileStream(blob)
      ElMessage.success('示例图片下载成功')
    } else {
      ElMessage.warning('未获取到可下载的文件')
    }
  } catch {
    ElMessage.error('示例图片下载失败')
  }
}

// 方式三：请求拦截器下载，通过 axios responseType: blob 自动下载
const downloadByRequest = () => {
  void requestBlob()
    .then(() => {
      ElMessage.success('请求下载已发起')
    })
    .catch(() => {
      ElMessage.error('请求下载失败')
    })
}
</script>

<style scoped lang="scss">
.download-page {
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
      var(--el-color-info-light-9)
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
    background: linear-gradient(135deg, #409eff, #909399);
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

// 单张方法卡片
.dl-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 22px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--global-shadow-color);
  }

  // 渐变背景圆形图标
  &__icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;

    svg {
      width: 24px;
      height: 24px;
    }

    &--primary {
      background: linear-gradient(135deg, #409eff, #1677ff);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.32);
    }

    &--success {
      background: linear-gradient(135deg, #67c23a, #529b2e);
      box-shadow: 0 6px 16px rgba(103, 194, 58, 0.32);
    }

    &--warning {
      background: linear-gradient(135deg, #e6a23c, #cf8b15);
      box-shadow: 0 6px 16px rgba(230, 162, 60, 0.32);
    }
  }

  &__title {
    margin: 0;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  &__desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-secondary);
    min-height: 42px;
  }

  &__btn {
    width: 100%;
    margin-top: auto;
  }
}

// 底部说明卡片
.dl-tips {
  padding: 20px 22px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    font-size: 15px;
    color: var(--el-text-color-primary);

    svg {
      width: 18px;
      height: 18px;
      color: var(--el-color-primary);
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  &__group-title {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  &__list {
    margin: 0;
    padding-left: 18px;
    font-size: 12px;
    line-height: 1.9;
    color: var(--el-text-color-secondary);

    b {
      color: var(--el-text-color-primary);
      font-weight: 600;
    }
  }
}

// 响应式：760px 以下变为单列
@media (max-width: 760px) {
  .download-page__grid {
    grid-template-columns: 1fr;
  }

  .download-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .download-page__capabilities {
    justify-content: flex-start;
  }

  .dl-tips__content {
    grid-template-columns: 1fr;
  }
}
</style>
