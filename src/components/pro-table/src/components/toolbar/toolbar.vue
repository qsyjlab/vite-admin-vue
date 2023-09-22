<template>
  <div class="pro-table-header">
    <div class="pro-table-header__left">
      <slot name="headerTitle">
        <span class="pro-table-header__title" v-if="headerTitle">
          {{ headerTitle }}
        </span>
      </slot>
    </div>
    <div class="pro-table-header__right">
      <el-space>
        <slot name="toolbar"></slot>

        <el-tooltip v-if="optionsObj.reload" effect="dark" content="刷新" placement="top">
          <span class="cursor" @click="tableActionRef.refresh"
            ><el-icon :size="18"> <RefreshRight /> </el-icon
          ></span>
        </el-tooltip>

        <SettingColumns v-if="optionsObj.setting" :columns="columns" />

        <el-tooltip v-if="optionsObj.density" effect="dark" content="密度" placement="top">
          <span class="cursor">
            <el-dropdown>
              <span>
                <el-icon :size="18">
                  <Density />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in sizeTypes"
                    :key="index"
                    @click="mergeTableProps({ size: item.size })"
                    >{{ item.title }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </el-tooltip>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTableStoreContext } from '../../store'
import { RefreshRight } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { Density } from '../../../../icon'
import SettingColumns from '../column-setting/column-setting.vue'
import type { ProTableProps } from '../../props'
import type { ProTableColumns, TableOptions } from '../../types'

defineSlots<{
  headerTitle: () => void
  toolbar: () => void
}>()

const sizeTypes: {
  title: string
  size: ProTableProps['size']
}[] = [
  { title: '大', size: 'large' },
  { title: '默认', size: 'default' },
  { title: '小', size: 'small' }
]

/** TODO: 需要排查当禁用后是否还会进行的计算 */

const DEFAULT_OPTIONS = {
  reload: true,
  density: true,
  setting: true
}

const props = withDefaults(
  defineProps<{
    columns?: ProTableColumns
    headerTitle?: string
    options?: TableOptions
  }>(),
  {
    headerTitle: '',
    columns: () => [],
    options: () => ({})
  }
)

const { mergeTableProps, tableActionRef } = useTableStoreContext()

const optionsObj = computed(() => {
  if (typeof props.options === 'boolean') {
    if (props.options) {
      return {
        reload: true,
        density: true,
        setting: true
      }
    }

    if (props.options === false)
      return {
        reload: false,
        density: false,
        setting: false
      }
  }

  return {
    ...DEFAULT_OPTIONS,
    ...props.options
  }
})
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
