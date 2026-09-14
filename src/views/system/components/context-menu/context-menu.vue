<template>
  <page-wrapper class="context-menu-page">
    <g-page-header
      title="右键菜单"
      description="演示 ProContextMenu 组件的点击、右键、混合触发以及 v-contextmenu 指令用法。"
      :icon="Menu"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">组件触发</el-tag>
        <el-tag effect="plain" type="success">指令触发</el-tag>
      </template>
    </g-page-header>

    <pro-card title="触发方式" subtitle="四种触发方式均输出点击项到控制台">
      <div class="context-menu-page__demos">
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
      </div>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Menu } from '@element-plus/icons-vue'
import { GPageHeader, PageWrapper } from '@/components'
import { ProContextMenu, type ProContextMenuItem } from '@/components/context-menu'

defineOptions({
  name: 'ContextMenu'
})

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
<style scoped lang="scss">
.context-menu-page {
  gap: 16px;

  &__demos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
}
</style>
