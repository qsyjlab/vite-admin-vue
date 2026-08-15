<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <span style="width: 30%">
        <el-space>
          <pro-context-menu
            :menus="contextMenus"
            :item-height="30"
            :trigger="['click']"
            @click-menu="clickMemnu"
          >
            <el-button>点击触发</el-button>
          </pro-context-menu>

          <pro-context-menu :menus="contextMenus" @click-menu="clickMemnu">
            <el-button>右键菜单触发</el-button>
          </pro-context-menu>

          <pro-context-menu
            :menus="contextMenus"
            :trigger="['click', 'contextmenu']"
            @click-menu="clickMemnu"
          >
            <el-button>都可以触发</el-button>
          </pro-context-menu>

          <el-button v-contextmenu="{ menus: [{ title: '测试指令', command: 'test' }] }"
            >指令触发</el-button
          >
        </el-space>
      </span>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ProContextMenu, type ProContextMenuItem } from '@/components/context-menu'

const contextMenus: ProContextMenuItem[] = [
  {
    title: 'item1',
    command: 'item1',
    children: [
      {
        title: 'item1-1',
        command: 'item1-1'
      },
      {
        title: 'item1-2',
        command: 'item1-2'
      }
    ]
  },
  {
    title: 'item2',
    command: 'item2',
    children: [
      {
        title: 'item2-1',
        command: 'item2-1'
      },
      {
        title: 'item2-2',
        command: 'item2-2'
      }
    ]
  },
  {
    title: 'item3',
    command: 'item3'
  },
  {
    title: 'item4',
    command: 'item4'
  }
]

const clickMemnu = (...rest) => {
  console.log('click-menu', rest)
}
</script>
<style scoped></style>
