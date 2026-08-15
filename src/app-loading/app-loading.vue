<template>
  <div class="app-splash" role="status" :aria-label="`${appTitle} 正在加载`">
    <div class="app-splash__content">
      <div class="app-splash__logo-wrap">
        <img class="app-splash__logo" :src="logoUrl" alt="" />
      </div>

      <div class="app-splash__title">{{ appTitle }}</div>

      <div class="app-splash__indicator" aria-hidden="true">
        <i v-for="index in 4" :key="index"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  appTitle: string
  logoUrl: string
}>()
</script>

<style lang="scss" scoped>
.app-splash {
  --app-splash-bg: #f5f7fa;
  --app-splash-surface: #ffffff;
  --app-splash-border: #dcdfe6;
  --app-splash-text: #303133;
  --app-splash-primary: #1677ff;

  position: fixed;
  z-index: 99999;
  inset: 0;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  color: var(--app-splash-text);
  background: var(--app-splash-bg);

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo-wrap {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    box-sizing: border-box;
    border: 1px solid var(--app-splash-border);
    border-radius: 8px;
    background: var(--app-splash-surface);
  }

  &__logo {
    display: block;
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  &__title {
    margin-top: 18px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
  }

  &__indicator {
    display: grid;
    grid-template-columns: repeat(4, 7px);
    gap: 7px;
    height: 7px;
    margin-top: 20px;

    i {
      display: block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--app-splash-primary);
      animation: app-splash-pulse 1.2s ease-in-out infinite;

      @for $index from 2 through 4 {
        &:nth-child(#{$index}) {
          animation-delay: #{($index - 1) * 0.12}s;
        }
      }
    }
  }
}

:global(html.dark) .app-splash,
:global(html[data-theme='dark']) .app-splash {
  --app-splash-bg: #172036;
  --app-splash-surface: #1f2a40;
  --app-splash-border: #2d3a52;
  --app-splash-text: #e5eaf3;
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.light):not([data-theme='light'])) .app-splash {
    --app-splash-bg: #172036;
    --app-splash-surface: #1f2a40;
    --app-splash-border: #2d3a52;
    --app-splash-text: #e5eaf3;
  }
}

@keyframes app-splash-pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-splash__indicator i {
    animation: none;
    opacity: 0.65;
  }
}
</style>
