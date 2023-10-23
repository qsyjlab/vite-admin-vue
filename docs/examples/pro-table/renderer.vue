<template>
  <div>
    <ProTable
      header-title="基本使用"
      v-model:loading="loading"
      checkable
      :columns="columns"
      :request="request"
      :params="params"
      :transform="transform"
      :transformParams="transformParams"
      @register="register"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ProTableColumns, useProTable } from '../../.vitepress/.exampleCompnents/index'

const loading = ref(false)
const params = ref({})

const { register } = useProTable()

const columns: ProTableColumns = [
  {
    key: 'indexBorder',
    valueType: 'indexBorder',
    tip: '通过 indexBorder 实现序号列,并支持其他自定义属性',
    width: 200,
    title: '自定义 序号列'
  },
  {
    title: '默认渲染器',
    key: 'default',
    valueType: 'text'
  },

  {
    title: '枚举类型',
    key: 'status',
    valueType: 'enum',
    valueEnum: {
      all: { text: '全部', color: 'blue' },
      open: {
        text: '未解决',
        color: 'green'
      },
      closed: {
        text: '已解决',
        color: 'red'
      },
      processing: {
        text: '解决中',
        color: 'blue'
      }
    }
  },
  {
    title: '进度条',
    key: 'progress',
    valueType: 'progress'
  },
  {
    title: '渲染图片',
    key: 'image',
    valueType: 'image'
  }
]

function sleep(delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({})
    }, delay)
  })
}

const request = async () => {
  await sleep()
  return Promise.resolve({
    data: [
      {
        default: '默认渲染器',
        status: 'all',
        progress: 100,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'open',
        progress: 100,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'closed',
        progress: 100,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        status: 'processing',
        default: '默认渲染器',
        date: '2016-05-01',
        progress: 20,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        status: 'processing',
        default: '默认渲染器',
        progress: 30,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'closed',
        progress: 40,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'closed',
        progress: 30,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'closed',
        progress: 99,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'closed',
        progress: 30,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      },
      {
        default: '默认渲染器',
        status: 'closed',
        progress: 38,
        image: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
      }
    ],
    total: 30
  })
}

const transformParams = params => {
  console.log('transformParams', transformParams)

  return params
}

const transform = data => {
  console.log('data', data)

  return {
    data: data.data,
    total: data.total
  }
}
</script>
<style scoped></style>
