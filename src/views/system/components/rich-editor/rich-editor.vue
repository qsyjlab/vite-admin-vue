<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <TinymceVueEditor :init="editorInit" />
  </el-card>
</template>
<script setup lang="ts">
import tinymce from 'tinymce/tinymce'
import TinymceVueEditor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme.min'
import 'tinymce/icons/default'
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/importcss' //图片工具
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/codesample' // 插入代码
import 'tinymce/plugins/code' // 查看源码
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/link' //
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/template' //插入模板
import 'tinymce/plugins/save' // 保存
import 'tinymce/plugins/searchreplace' //查询替换
import 'tinymce/plugins/pagebreak' //分页
import 'tinymce/plugins/insertdatetime' //时间插
import { onMounted } from 'vue'

const editorInit = {
  skin_url: '/resource/tinymce/skins/ui/oxide',
  content_css: '/resource/tinymce/skins/content/default/content.css',
  language_url: '/resource/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  // 黑暗模式
  // skin_url: '/skins-2/ui/oxide-dark',
  // content_css: '/skins-2/content/dark/content.css',
  plugins: 'lists image media table wordcount save preview',
  toolbar:
    'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
  branding: false,
  height: 300
}

onMounted(() => {
  tinymce.init({})
})
</script>
<style scoped></style>
