<template>
  <page-wrapper>
    <page-card class="route-hero" header="Route Engine 概览" style="margin-bottom: 16px">
      <div class="hero-layout">
        <div>
          <p class="hero-title">把路由定义、权限过滤、菜单投影和动态注册收敛到一条清晰链路。</p>
          <p class="hero-desc">
            示例页用于验证框架约定是否稳定：路由只描述页面能力，菜单只负责展示，权限只负责准入。
          </p>
        </div>
        <div class="hero-stats">
          <div v-for="item in stats" :key="item.label" class="stat-item">
            <span>{{ item.value }}</span>
            <small>{{ item.label }}</small>
          </div>
        </div>
      </div>
    </page-card>

    <div class="flow-grid">
      <page-card
        v-for="item in flow"
        :key="item.title"
        :header="item.title"
        class="flow-card"
        :full="false"
      >
        <div class="flow-index">{{ item.index }}</div>
        <p>{{ item.desc }}</p>
        <el-tag size="small" effect="plain">{{ item.tag }}</el-tag>
      </page-card>
    </div>

    <page-card header="建议约定">
      <div class="rule-grid">
        <div v-for="item in rules" :key="item.label" class="rule-item">
          <strong>{{ item.label }}</strong>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
const stats = [
  { label: '路由层级', value: '4' },
  { label: '处理阶段', value: '5' },
  { label: '菜单来源', value: 'meta' }
]

const flow = [
  {
    index: '01',
    title: 'Normalize',
    desc: '补齐 Layout、BlankContainer、redirect 与路径信息，保证后续处理输入稳定。',
    tag: '结构标准化'
  },
  {
    index: '02',
    title: 'Authorize',
    desc: '根据 permissionMode、ignoreAuth、登录态与权限集合过滤可访问路由。',
    tag: '准入控制'
  },
  {
    index: '03',
    title: 'Menu Project',
    desc: '把路由投影成菜单，处理 title、icon、order、hidden 与单子节点提升。',
    tag: '菜单投影'
  },
  {
    index: '04',
    title: 'Register',
    desc: '动态 addRoute 并补充 fallback，避免权限路由刷新后丢失页面入口。',
    tag: '动态注册'
  }
]

const rules = [
  { label: '路由定义', value: '优先使用 defineRoutes / defineRoute，不手写空 component' },
  { label: '菜单控制', value: '统一用 meta.menu 覆盖展示字段，meta.title/icon 作为兜底' },
  { label: '开放页面', value: '登录、异常、文档和演示页显式声明 meta.ignoreAuth' },
  { label: '缓存页面', value: '只在业务页设置 meta.isKeepAlive，避免缓存容器页' }
]
</script>

<style lang="scss" scoped>
.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
}

.hero-title {
  margin: 0;
  color: var(--global-heading-color);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}

.hero-desc {
  margin: 8px 0 0;
  color: var(--global-text-color-secondary);
  line-height: 1.7;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 88px);
  gap: 10px;
}

.stat-item {
  height: 72px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;

  span {
    color: var(--el-color-primary);
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  small {
    margin-top: 8px;
    color: var(--global-text-color-secondary);
    font-size: 12px;
  }
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.flow-card {
  position: relative;

  p {
    min-height: 74px;
    margin: 0 0 16px;
    color: var(--global-text-color-secondary);
    line-height: 1.7;
  }
}

.flow-index {
  position: absolute;
  top: 18px;
  right: 24px;
  color: #c9d4e4;
  font-size: 24px;
  font-weight: 700;
}

.rule-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.rule-item {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 14px 16px;
  background: #fbfdff;

  strong {
    display: block;
    margin-bottom: 8px;
    color: var(--global-heading-color);
  }

  span {
    color: var(--global-text-color-secondary);
    line-height: 1.6;
  }
}

@media (max-width: 1200px) {
  .hero-layout,
  .flow-grid,
  .rule-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
