<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button type="primary" class="mb-20px" @click="exportHtmlToWord">导出 word</el-button>

      <pro-tinymce v-model="content"></pro-tinymce>

      <template v-if="false">
        <div v-for="heading in headings" :key="heading.id" @click="jumpTo(heading)">
          {{ heading.title }}
        </div>
      </template>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { asBlob } from 'html-docx-js-typescript'
import { downloadFile } from '@/utils'

const content = ref(`
<h1 class="tinymce-h1">正文标题</h1>
<p>asdasasd</p>
<p>asdasd</p>
<h2 class="tinymce-h2">二级正文</h2>
<h1 class="tinymce-h1">以及一级正文</h1>`)

const headings = ref<
  {
    title: string
    id: string
  }[]
>([])

content.value = addUniqueKeyToHeading(content.value)

const exportHtmlToWord = () => {
  handleRichText(content.value)

  asBlob(handleRichText(content.value)).then(data => {
    downloadFile(URL.createObjectURL(data as Blob), `${new Date().getTime()}.docx`)
  })
}

const jumpTo = (item: any) => {
  console.log('item', item)

  const iframe = document.querySelector('iframe')

  if (!iframe) return

  console.log('iframe', iframe)

  // 获取 iframe 内文档
  const iframeDocument = iframe?.contentDocument || iframe.contentWindow?.document

  if (!iframeDocument) return

  console.log('iframeDocument', iframeDocument)

  // 获取锚点元素
  const anchorElement = iframeDocument.getElementById(item.id)

  console.log('anchorElement', anchorElement)

  // 滚动到锚点位置
  iframe.contentWindow?.scrollTo({
    top: anchorElement?.offsetTop || 0,
    behavior: 'smooth'
  })
}

function handleRichText(text: string) {
  const el = document.createElement('div')
  el.innerHTML = text

  return el.innerHTML.toString()
}

function addUniqueKeyToHeading(text: string) {
  const el = document.createElement('div')
  el.innerHTML = text

  let startUniqueId = new Date().getTime()

  Array.from(el.querySelectorAll('h1,h2,h3,h4,h5')).forEach(node => {
    node.id = String(startUniqueId++)
    headings.value.push({
      title: node.textContent || '',
      id: node.id
    })
  })

  return el.innerHTML.toString()
}
</script>
<style scoped></style>
