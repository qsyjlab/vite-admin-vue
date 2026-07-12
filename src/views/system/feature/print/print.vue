<template>
  <page-wrapper class="print-page">
    <!-- 渐变标题区 -->
    <header class="print-page__header">
      <div class="print-page__title">
        <div class="print-page__title-icon">
          <Printer />
        </div>
        <div class="print-page__title-text">
          <h1>页面打印</h1>
          <p>基于 html2canvas 截图与 print-js 实现网页内容精准打印，支持水印与分页输出。</p>
        </div>
      </div>
      <div class="print-page__capabilities">
        <el-tag effect="plain" type="primary">截图打印</el-tag>
        <el-tag effect="plain" type="success">水印</el-tag>
        <el-tag effect="plain" type="warning">分页</el-tag>
      </div>
    </header>

    <!-- 操作工具栏 -->
    <div class="print-page__toolbar">
      <el-button type="primary" :icon="Printer" @click="handlePrint">打印当前表格</el-button>
      <span class="print-page__toolbar-tip">
        点击按钮将下方表格截图后调用浏览器打印，水印会一并保留在输出结果中。
      </span>
    </div>

    <!-- 打印预览区域（带水印） -->
    <section
      ref="tableRef"
      v-watermark="{ content: '内部资料·请勿外传' }"
      class="print-page__preview"
    >
      <table class="print-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>部门</th>
            <th>职位</th>
            <th>入职时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in employeeList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.department }}</td>
            <td>{{ item.position }}</td>
            <td>{{ item.hireDate }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import printJS from 'print-js'
import html2canvas from 'html2canvas'
import { ref } from 'vue'
import { Printer } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'

defineOptions({ name: 'PrintPage' })

// 员工信息类型
interface Employee {
  id: number
  name: string
  age: number
  department: string
  position: string
  hireDate: string
}

// 员工列表数据（示例 20 条）
const employeeList: Employee[] = [
  {
    id: 1,
    name: '张伟',
    age: 28,
    department: '技术部',
    position: '前端工程师',
    hireDate: '2021-03-15'
  },
  {
    id: 2,
    name: '李娜',
    age: 32,
    department: '产品部',
    position: '产品经理',
    hireDate: '2019-07-22'
  },
  {
    id: 3,
    name: '王强',
    age: 35,
    department: '技术部',
    position: '后端工程师',
    hireDate: '2018-05-10'
  },
  {
    id: 4,
    name: '刘洋',
    age: 26,
    department: '设计部',
    position: 'UI 设计师',
    hireDate: '2022-09-01'
  },
  {
    id: 5,
    name: '陈静',
    age: 29,
    department: '市场部',
    position: '市场专员',
    hireDate: '2021-11-08'
  },
  {
    id: 6,
    name: '杨帆',
    age: 38,
    department: '技术部',
    position: '架构师',
    hireDate: '2017-04-18'
  },
  {
    id: 7,
    name: '赵磊',
    age: 31,
    department: '运营部',
    position: '运营主管',
    hireDate: '2020-06-30'
  },
  {
    id: 8,
    name: '孙丽',
    age: 27,
    department: '人事部',
    position: 'HR 专员',
    hireDate: '2022-03-14'
  },
  {
    id: 9,
    name: '周杰',
    age: 33,
    department: '技术部',
    position: '测试工程师',
    hireDate: '2019-10-25'
  },
  { id: 10, name: '吴敏', age: 30, department: '财务部', position: '会计', hireDate: '2020-12-01' },
  {
    id: 11,
    name: '郑浩',
    age: 29,
    department: '技术部',
    position: '前端工程师',
    hireDate: '2021-08-09'
  },
  {
    id: 12,
    name: '冯雪',
    age: 25,
    department: '设计部',
    position: '视觉设计师',
    hireDate: '2023-02-20'
  },
  {
    id: 13,
    name: '褚明',
    age: 34,
    department: '产品部',
    position: '产品总监',
    hireDate: '2018-01-15'
  },
  {
    id: 14,
    name: '卫华',
    age: 41,
    department: '技术部',
    position: '技术总监',
    hireDate: '2016-05-20'
  },
  {
    id: 15,
    name: '蒋涛',
    age: 28,
    department: '运营部',
    position: '内容运营',
    hireDate: '2021-09-12'
  },
  {
    id: 16,
    name: '沈琳',
    age: 31,
    department: '市场部',
    position: '品牌经理',
    hireDate: '2020-04-06'
  },
  { id: 17, name: '韩磊', age: 36, department: '技术部', position: 'DBA', hireDate: '2018-08-30' },
  {
    id: 18,
    name: '杨梅',
    age: 26,
    department: '人事部',
    position: '招聘专员',
    hireDate: '2022-07-18'
  },
  {
    id: 19,
    name: '朱辉',
    age: 30,
    department: '技术部',
    position: '运维工程师',
    hireDate: '2020-10-22'
  },
  {
    id: 20,
    name: '秦爽',
    age: 29,
    department: '产品部',
    position: '数据分析师',
    hireDate: '2021-05-17'
  }
]

const tableRef = ref<HTMLDivElement>()

// 打印：将表格区域截图为图片后调用浏览器打印
const handlePrint = () => {
  if (!tableRef.value) return
  html2canvas(tableRef.value).then(canvas => {
    const image = new Image()
    image.src = canvas.toDataURL()
    image.onload = () => {
      printJS({
        printable: image.src,
        type: 'image',
        header: '',
        documentTitle: '员工信息表格',
        style: '@media print { @page { size: auto; margin: 0; } body { margin: 0 5px; } }'
      })
    }
  })
}
</script>

<style scoped lang="scss">
.print-page {
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

  &__title-text {
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

  &__capabilities {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    flex: none;
  }

  // 操作工具栏
  &__toolbar {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    padding: 14px 18px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
    box-shadow: 0 2px 8px var(--global-shadow-color);
  }

  &__toolbar-tip {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  // 打印预览区域
  &__preview {
    position: relative;
    max-height: 500px;
    overflow: auto;
    padding: 0;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
    box-shadow: 0 4px 12px var(--global-shadow-color);
  }
}

// 表格样式
.print-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: var(--el-text-color-primary);

  th,
  td {
    padding: 10px 14px;
    text-align: left;
    white-space: nowrap;
    border: 1px solid var(--el-border-color-lighter);
  }

  thead th {
    background: var(--el-fill-color-light);
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  tbody td {
    color: var(--el-text-color-regular);
  }

  tbody tr:nth-child(even) {
    background: var(--el-fill-color-blank);
  }

  tbody tr:hover {
    background: var(--el-color-primary-light-9);
    transition: background-color 0.2s ease;
  }
}

// 响应式
@media (max-width: 760px) {
  .print-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .print-page__capabilities {
    justify-content: flex-start;
  }

  .print-table th,
  .print-table td {
    padding: 8px 10px;
  }
}
</style>
