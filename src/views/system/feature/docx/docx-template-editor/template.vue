<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button type="primary" class="mb-20px" @click="exportHtmlToWord">导出 word</el-button>

      <el-row>
        <el-col :span="7">
          <catalogue-tree :data="headingsTreeData"></catalogue-tree>
        </el-col>
        <el-col :span="17">
          <div id="wrap">
            <div ref="templateRef" class="template" @input="eventDelegation">
              <h2
                class="edit-class-1"
                data-edit-id="2"
                contenteditable
                @focus="contenteditableFocus"
              >
                xxx情况报告
              </h2>

              <p contenteditable>致某人xxxx：</p>
              <p style="text-indent: 2em">测试正文内容</p>
              <h2
                data-edit-id="3"
                class="edit-class-2"
                contenteditable
                @focus="contenteditableFocus"
              >
                一、测试二级标题
              </h2>
              <p style="text-indent: 2em" contenteditable>二级标题的正文</p>
              <h3>（一）三级标题</h3>
              <h3>（二）三级标题</h3>
              <h4>（1.）四季级标题</h4>
              <h4>（1.）四季级标题</h4>
              <h4>（1.）四季级标题</h4>
              <h4>（1.）四季级标题</h4>
              <h2 contenteditable>一、测试二级标题</h2>
              <p style="text-indent: 2em" contenteditable>二级标题的正文</p>
              <h2 contenteditable>一、测试二级标题</h2>
              <p style="text-indent: 2em" contenteditable>二级标题的正文</p>
            </div>
          </div></el-col
        >
      </el-row>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import tinymce from 'tinymce'

import { asBlob } from 'html-docx-js-typescript'
import { downloadFile } from '@/utils'
import '@/components/tinymce/src/source'

import CatalogueTree from './catalogue-tree.vue'

const templateRef = ref<HTMLDivElement>()

interface Heading {
  el: Element
  label: string
  id: string
  level: number
  children?: Heading[]
}

// 生成大纲目录的标签
const HEADDING_TAGS = ['h1', 'h2', 'h3', 'h4']

const headings = ref<Heading[]>([])

// 主题
const themeMode = computed(() => {
  return 'oxide'
})

// 语言
const lang = computed(() => {
  return 'zh_CN'
})

onMounted(() => {
  initializeEditor()
})

const headingsTreeData = computed(() => {
  return flattenHeadingsToTree(headings.value)
})

function bindEvent(heading: Element) {
  heading.addEventListener('mouseover', event => {
    console.log('over')

    event.stopPropagation()

    const handle = heading.querySelector('.add-handle')

    if (handle) return
    const button = document.createElement('div')

    button.classList.add('add-handle')
    button.innerText = '添加'
    button.addEventListener('click', () => {
      const h2 = document.createElement('h2')
      h2.setAttribute('contenteditable', '')

      h2.innerText = '测试新增的东西'

      bindEvent(h2)

      templateRef.value?.append(h2)
    })

    heading.append(button)
  })

  heading.addEventListener('mouseleave', () => {
    heading.querySelector('.add-handle')?.remove()
  })
}

function initializeEditor() {
  const _headings = templateRef.value?.querySelectorAll('h1,h2,h3,h4')

  if (!_headings?.length) return

  Array.from(_headings).forEach(heading => {
    headings.value.push({
      label: heading.textContent || '',
      id: '',
      el: heading,
      level: Number(heading.tagName?.substring(1, 2))
    })

    bindEvent(heading)
  })

  console.log(' headings.value', headings.value)
}

// 事件委托父级
function eventDelegation(event: Event) {
  const target = event.target as any
  const tagName = target.tagName as string

  if (HEADDING_TAGS.includes(tagName.toLocaleLowerCase())) {
    updateHeadings()
  }
}

function updateHeadings() {
  headings.value = []
  const _headings = templateRef.value?.querySelectorAll(HEADDING_TAGS.join(','))

  if (!_headings?.length) return

  Array.from(_headings).forEach(heading => {
    headings.value.push({
      label: heading.textContent || '',
      id: '',
      el: heading,
      level: Number(heading.tagName?.substring(1, 2))
    })
  })
}

// 将扁平目录格式化成树形
function flattenHeadingsToTree(data: Heading[]) {
  const tree: Heading[] = []
  let stack: Heading[] = []

  data.forEach(item => {
    const node: Heading = {
      id: item.id,
      label: item.label,
      level: item.level,
      children: [],
      el: item.el
    }

    while (stack.length > 0 && stack[stack.length - 1]!.level >= item!.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      tree.push(node)
    } else {
      if (stack[stack.length - 1].children) {
        stack[stack.length - 1].children!.push(node)
      }
    }

    stack.push(node)
  })

  return tree
}

//
function contenteditableFocus(event: Event) {
  const target = event.target as any
  const publicPath = '/'
  const dataset = target.dataset

  const resource = `${publicPath}resource/tinymce`
  tinymce.init({
    selector: `.edit-class-2`,
    inline: true,
    skin_url: `${resource}/skins/ui/${themeMode.value}`,
    branding: false,
    codesample_preview: true,
    default_link_target: '_blank',
    link_title: false,
    object_resizing: false,
    auto_focus: true,
    content_css: `${resource}/skins/content/default/content.css`,
    language_url: `${resource}/langs/${lang.value}.js`,
    toolbar:
      'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat'
  })
}

// 导出
const exportHtmlToWord = () => {
  const richText = templateRef.value?.outerHTML || ''

  asBlob(richText).then(data => {
    downloadFile(URL.createObjectURL(data as Blob), `${new Date().getTime()}.docx`)
  })
}
</script>
<style lang="scss">
.template {
  h1,
  h2 {
    position: relative;
  }

  .template {
    position: relative;
  }

  .add-handle {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
