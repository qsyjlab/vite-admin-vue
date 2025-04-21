<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <pro-form :fields="fields" :label-width="120" @register="register"></pro-form>

      <div style="display: flex; justify-content: center">
        <el-space>
          <el-button @click="encryptHandler">加密并解密</el-button>
        </el-space>
      </div>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { useProForm, type FormSchema } from '@/components'
import { encrypt, decrypt } from '@/utils'

const fields: FormSchema[] = [
  {
    label: '文本',
    key: 'text',
    el: 'el-input',
    attrs: {
      type: 'textarea'
    }
  },
  {
    label: '加密后文本',
    key: 'encrypt',
    el: 'el-input',
    attrs: {
      type: 'textarea'
    }
  },
  {
    label: '加密后解密文本',
    key: 'decrypt',
    el: 'el-input',
    attrs: {
      type: 'textarea'
    }
  }
]

const { register, forceUpdateModel, validate } = useProForm()

const encryptHandler = () => {
  validate(model => {
    const encryptText = encrypt(model.text)
    forceUpdateModel({
      encrypt: encryptText,
      decrypt: decrypt(encryptText)
    })
  })
}
</script>
<style scoped></style>
