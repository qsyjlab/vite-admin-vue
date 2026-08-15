<template>
  <page-wrapper>
    <page-card header="菜单投影规则" style="margin-bottom: 16px">
      <div class="projection-head">
        <div>
          <p>路由是页面能力的来源，菜单是导航展示的结果。推荐只维护一套覆盖入口，减少字段重复。</p>
        </div>
        <el-tag type="warning" effect="light">meta.menu 优先</el-tag>
      </div>
    </page-card>

    <page-card header="字段映射" style="margin-bottom: 16px">
      <el-table :data="mappingRows" border>
        <el-table-column prop="source" label="输入字段" min-width="240" />
        <el-table-column prop="target" label="菜单字段" min-width="160" />
        <el-table-column prop="note" label="说明" min-width="320" />
      </el-table>
    </page-card>

    <div class="practice-grid">
      <page-card v-for="item in practices" :key="item.title" :header="item.title" :full="false">
        <p>{{ item.desc }}</p>
        <el-tag size="small" :type="item.type" effect="plain">{{ item.tag }}</el-tag>
      </page-card>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
const mappingRows = [
  {
    source: 'meta.menu.title ?? meta.title',
    target: 'menu.title',
    note: '菜单标题优先，路由标题用于兜底和 tabs 展示'
  },
  {
    source: 'meta.menu.icon ?? meta.icon',
    target: 'menu.icon',
    note: '菜单图标可覆盖，未配置时复用路由图标'
  },
  {
    source: 'meta.menu.order ?? meta.order',
    target: 'menu.order',
    note: '排序仅对同级生效，避免跨级比较大小'
  },
  {
    source: 'meta.menu.hidden ?? meta.hideInMenu',
    target: 'menu.hidden',
    note: '建议逐步收敛到 menu.hidden，减少老字段并存'
  },
  {
    source: 'meta.menu.hideChildrenInMenu ?? meta.hideChildrenInMenu',
    target: 'menu.hideChildrenInMenu',
    note: '控制父级是否直接提升第一个有效子页面'
  }
]

const practices = [
  {
    title: '隐藏菜单',
    desc: '辅助页和跳转页保留路由，但从菜单隐藏，避免导航出现重复或半成品入口。',
    tag: 'hidden',
    type: 'info' as const
  },
  {
    title: '单子节点提升',
    desc: '只对非业务分组使用 promoteSingleChild，业务分组保持层级便于认知。',
    tag: 'promote',
    type: 'success' as const
  },
  {
    title: '图标策略',
    desc: '父级必配图标，叶子节点按页面重要度配置，避免菜单视觉噪声过重。',
    tag: 'icon',
    type: 'warning' as const
  }
]
</script>

<style lang="scss" scoped>
.projection-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  p {
    margin: 0;
    color: var(--global-text-color-secondary);
    line-height: 1.7;
  }
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  p {
    min-height: 76px;
    margin: 0 0 14px;
    color: var(--global-text-color-secondary);
    line-height: 1.7;
  }
}

@media (max-width: 1200px) {
  .practice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
