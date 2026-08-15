<template>
  <pro-card
    class="pro-statistic-card"
    :bordered="bordered"
    :shadow="shadow"
    :loading="loading"
    :body-padding="bodyPadding"
  >
    <div class="pro-statistic-card__main">
      <div class="pro-statistic-card__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="pro-statistic-card__value-row">
        <span v-if="prefix" class="pro-statistic-card__affix">{{ prefix }}</span>
        <span class="pro-statistic-card__value">{{ formattedValue }}</span>
        <span v-if="suffix" class="pro-statistic-card__affix">{{ suffix }}</span>
        <span
          v-if="trendValue !== undefined"
          class="pro-statistic-card__trend"
          :class="`is-${trend}`"
        >
          <el-icon v-if="trend !== 'flat'"
            ><component :is="trend === 'up' ? Top : Bottom"
          /></el-icon>
          {{ trendValue }}
        </span>
      </div>
      <div v-if="description || $slots.description" class="pro-statistic-card__description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <div v-if="$slots.chart || $slots.default" class="pro-statistic-card__chart">
      <slot name="chart"><slot /></slot>
    </div>
  </pro-card>
</template>

<script setup lang="ts" generic="TValue extends string | number = number">
import { computed } from 'vue'
import { Bottom, Top } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import ProCard from './pro-card.vue'
import type { ProStatisticCardProps } from './pro-card'

defineOptions({ name: 'ProStatisticCard' })

const props = withDefaults(defineProps<ProStatisticCardProps<TValue>>(), {
  trend: 'flat',
  precision: undefined,
  loading: false,
  bodyPadding: true
})

const formattedValue = computed(() => {
  if (props.formatter) return props.formatter(props.value)
  if (typeof props.value === 'number' && props.precision !== undefined) {
    return props.value.toFixed(props.precision)
  }
  return props.value ?? '-'
})
</script>

<style scoped lang="scss">
.pro-statistic-card {
  &__main {
    min-width: 0;
  }

  &__title,
  &__description {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  &__value-row {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px;
    margin-top: 10px;
  }

  &__value {
    color: var(--el-text-color-primary);
    font-size: 28px;
    font-weight: 600;
    line-height: 1.2;
  }

  &__affix {
    color: var(--el-text-color-regular);
  }

  &__trend {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);

    &.is-up {
      color: var(--el-color-success);
    }

    &.is-down {
      color: var(--el-color-danger);
    }
  }

  &__description {
    margin-top: 10px;
  }

  &__chart {
    min-width: 0;
    align-self: end;
  }
}
</style>
