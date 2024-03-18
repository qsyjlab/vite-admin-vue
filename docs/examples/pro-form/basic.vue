<template>
  <div>
    <ProForm inline :fields="fields" @submit="submit" @reset="reset"> </ProForm>
  </div>
</template>

<script setup lang="ts">
const fields = [
  {
    label: 'name',
    el: 'el-input',
    key: 'name',
    rules: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ],
    col: {
      span: 4
    }
  },
  {
    label: 'ProSelect',
    el: 'ProSelect',
    key: 'ProSelect',
    attrs: {
      options: [
        {
          label: '测试数据1',
          value: '测试数据1'
        },
        {
          label: '测试数据2',
          value: '测试数据2'
        },
        {
          label: '禁用项',
          value: '2',
          disabled: true
        }
      ]
    },
    events: {
      change: (...rest: any[]) => {
        console.log('rest change', rest)
      }
    },
    col: {
      span: 12
    }
  },
  {
    label: 'ProSelect 多选',
    el: 'ProSelect',
    key: 'ProSelectMutiple',
    attrs: {
      multiple: true,
      'collapse-tags': true,
      filterable: true,
      options: [
        {
          label: '测试数据1',
          value: '测试数据1'
        },
        {
          label: '测试数据2',
          value: '测试数据2'
        },
        {
          label: '测试数据3',
          value: '测试数据3'
        },
        {
          label: '禁用项',
          value: '2',
          disabled: true
        }
      ]
    },
    col: {
      span: 14
    }
  },
  {
    label: 'ProSelect 分组模式',
    el: 'ProSelect',
    key: 'ProSelectGroup',
    attrs: {
      group: true,
      options: [
        {
          label: 'Popular cities',
          options: [
            {
              value: 'Shanghai',
              label: 'Shanghai'
            },
            {
              value: 'Beijing',
              label: 'Beijing'
            }
          ]
        },
        {
          label: 'City name',
          options: [
            {
              value: 'Chengdu',
              label: 'Chengdu'
            },
            {
              value: 'Shenzhen',
              label: 'Shenzhen'
            },
            {
              value: 'Guangzhou',
              label: 'Guangzhou'
            },
            {
              value: 'Dalian',
              label: 'Dalian'
            }
          ]
        }
      ]
    },
    col: {
      span: 7
    }
  },
  {
    label: 'ProSelect 远程搜索模式',
    el: 'ProSelect',
    key: 'ProSelectRemote',
    attrs: {
      filterable: true,
      remote: true,
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 6
    }
  },
  {
    label: 'ProCheckboxGroup',
    el: 'ProCheckboxGroup',
    key: 'ProCheckboxGroup',
    attrs: {
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 20
    }
  },
  {
    label: 'ProCheckboxGroup 按钮模式',
    el: 'ProCheckboxGroup',
    key: 'ProCheckboxGruopButton',
    attrs: {
      tag: 'checkbox-button',
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 12
    }
  },
  {
    label: 'ProRadioGroup',
    el: 'ProRadioGroup',
    key: 'ProRadioGroup',
    attrs: {
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 20
    }
  },
  {
    label: 'ProRadioGroup 按钮模式',
    el: 'ProRadioGroup',
    key: 'ProRadioGruopButton',
    attrs: {
      tag: 'radio-button',
      options: [
        {
          value: 'Shanghai',
          label: 'Shanghai'
        },
        {
          value: 'Beijing',
          label: 'Beijing'
        }
      ]
    },
    col: {
      span: 12
    }
  }
]

const submit = (values: any) => {
  console.log('values', values)
}

const reset = (values: any) => {
  console.log('values', values)
}
</script>
