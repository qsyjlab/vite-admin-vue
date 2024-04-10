import { ExtractPropType } from 'element-plus/es/utils'
import { PropType } from 'vue'
import { THEME_MODE, LANGS, TOOLBAR, OUTPUT_FORMAT } from './editor'

export type OutputFormat = (typeof OUTPUT_FORMAT)[number]

export const tinymceProps = {
  /** 禁用编辑器 */
  disabled: {
    type: Boolean,
    default: false
  },
  // 主题
  theme: {
    type: String,
    default: THEME_MODE.light,
    validator: (value: string) => {
      return Object.values(THEME_MODE).includes(value)
    }
  },
  // 语言
  lang: {
    type: String,
    default: LANGS.zh_CH,
    validator: (value: string) => {
      return Object.values(LANGS).includes(value)
    }
  },
  height: {
    type: Number,
    default: 600
  },
  // 基本配置
  options: {
    type: Object,
    default: () => ({})
  },
  // 工具栏
  toolbar: {
    type: Array as PropType<string[]>,
    default: () => TOOLBAR
  },
  // v-model
  modelValue: {
    type: String
  },
  // editor.on 触发更新
  modelValueEvents: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  // 获取内容的类型
  outputFormat: {
    type: String as PropType<OutputFormat>,
    validtor: (value: OutputFormat) => OUTPUT_FORMAT.includes(value)
  }
}

export type TinymceProps = ExtractPropType<typeof tinymceProps>
