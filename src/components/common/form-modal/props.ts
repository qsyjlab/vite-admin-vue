/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-12 10:00:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-04-06 23:17:31
 */
import { PropType } from 'vue'
import type { FormType } from '../form/form'

export const buildProps = {
  // 表单对象
  form: {
    type: Array as PropType<FormType[]>,
    required: true,
    default: () => []
  },
  // 默认值
  defaultValue: Object,
  // 添加时候的标题
  addTitle: String,
  // 编辑时的 title
  editTitle: String,
  //新增 http
  httpAdd: Function,
  //编辑
  httpEdit: Function,
  // 编辑时详情获取
  httpDetails: Function,
  // 处理提交时的数据
  handler: {
    type: Function,
    default: data => data
  },
  width: {
    type: [String, Number],
    default: '500px'
  }
}
