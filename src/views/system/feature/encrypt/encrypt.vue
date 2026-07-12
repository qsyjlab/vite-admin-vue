<template>
  <page-wrapper class="encrypt-page">
    <header class="encrypt-page__header">
      <div class="encrypt-page__title">
        <div class="encrypt-page__title-icon">
          <Lock />
        </div>
        <div>
          <h1>RSA 加密解密</h1>
          <p>基于 JSEncrypt 实现 RSA 非对称加密，适用于敏感数据传输场景。</p>
        </div>
      </div>
      <div class="encrypt-page__capabilities">
        <el-tag effect="plain" type="primary">非对称加密</el-tag>
        <el-tag effect="plain" type="success">公钥加密</el-tag>
        <el-tag effect="plain" type="warning">私钥解密</el-tag>
      </div>
    </header>

    <div class="encrypt-page__main">
      <section class="encrypt-stage">
        <pro-form ref="formRef" :fields="fields" :label-width="120" />
        <div class="encrypt-stage__actions">
          <el-button type="primary" :icon="Lock" @click="encryptHandler">加密并解密</el-button>
          <el-button :icon="RefreshLeft" @click="clearAll">清空</el-button>
        </div>
      </section>

      <aside class="encrypt-aside">
        <div class="aside-card">
          <h3 class="aside-card__title">
            <InfoFilled />
            <span>加密原理</span>
          </h3>
          <p class="aside-card__desc">
            RSA
            是非对称加密算法，使用公钥加密、私钥解密。前端持有公钥加密敏感数据，后端使用私钥解密，保证数据传输安全。
          </p>
          <div class="flow-diagram">
            <div class="flow-node flow-node--primary">
              <span>明文</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node flow-node--warning">
              <Lock />
              <span>公钥加密</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node flow-node--info">
              <span>密文</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node flow-node--success">
              <Unlock />
              <span>私钥解密</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-node flow-node--primary">
              <span>明文</span>
            </div>
          </div>
        </div>

        <div class="aside-card aside-card--highlight">
          <h3 class="aside-card__title">
            <Key />
            <span>使用说明</span>
          </h3>
          <ul class="usage-list">
            <li>在"文本"输入框中填入需要加密的内容</li>
            <li>点击"加密并解密"按钮一键完成全流程</li>
            <li><b>encrypt</b> 函数使用公钥加密</li>
            <li><b>decrypt</b> 函数使用私钥解密</li>
            <li>RSA 有长度限制，超长文本需分段加密</li>
          </ul>
        </div>
      </aside>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { InfoFilled, Key, Lock, RefreshLeft, Unlock } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { useProForm, type FormMethodsType, type FormSchema } from '@vite-admin/pro-components'
import { encrypt, decrypt } from '@/utils'

defineOptions({ name: 'EncryptPage' })

const fields: FormSchema[] = [
  {
    label: '文本',
    key: 'text',
    el: 'el-input',
    attrs: {
      type: 'textarea',
      rows: 4,
      placeholder: '请输入需要加密的文本内容'
    }
  },
  {
    label: '加密后文本',
    key: 'encrypt',
    el: 'el-input',
    attrs: {
      type: 'textarea',
      rows: 4,
      readonly: true,
      placeholder: '加密结果将显示在这里'
    }
  },
  {
    label: '解密后文本',
    key: 'decrypt',
    el: 'el-input',
    attrs: {
      type: 'textarea',
      rows: 4,
      readonly: true,
      placeholder: '解密结果将显示在这里'
    }
  }
]

const formRef = useTemplateRef<FormMethodsType>('formRef')
const { forceUpdateModel, validate } = useProForm(formRef)

const encryptHandler = () => {
  validate(model => {
    if (!model.text) return
    const encryptText = encrypt(model.text as string)
    forceUpdateModel({
      encrypt: encryptText,
      decrypt: decrypt(encryptText)
    })
  })
}

function clearAll() {
  forceUpdateModel({ text: '', encrypt: '', decrypt: '' })
}
</script>

<style scoped lang="scss">
.encrypt-page {
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
    background: linear-gradient(135deg, #e6a23c, #d48806);
    color: #fff;
    box-shadow: 0 6px 16px rgba(230, 162, 60, 0.32);

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

.encrypt-stage {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);

  &__actions {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

.encrypt-aside {
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
    margin: 0 0 10px;
    font-size: 15px;
    color: var(--el-text-color-primary);

    svg {
      width: 16px;
      height: 16px;
      color: var(--el-color-primary);
    }
  }

  &__desc {
    margin: 0 0 16px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.7;
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

.flow-diagram {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.flow-node {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--global-control-radius);
  font-size: 12px;
  color: #fff;

  svg {
    width: 12px;
    height: 12px;
  }

  &--primary {
    background: var(--el-color-primary);
  }

  &--warning {
    background: var(--el-color-warning);
  }

  &--info {
    background: var(--el-color-info);
  }

  &--success {
    background: var(--el-color-success);
  }
}

.flow-arrow {
  color: var(--el-text-color-placeholder);
  font-size: 14px;
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
  .encrypt-page__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .encrypt-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .encrypt-page__capabilities {
    justify-content: flex-start;
  }
}
</style>
