<template>
  <div class="pro-table-header">
    <div class="pro-table-header__left">
      <slot name="title">
        <span class="pro-table-header__title" v-if="headerTitle">
          {{ headerTitle }}
        </span>
      </slot>
      <slot></slot>
    </div>
    <div class="pro-table-header__right">
      <el-space>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <span style="cursor: pointer" @click="tableActions.reload"
            ><el-icon :size="18"> <RefreshRight /> </el-icon
          ></span>
        </el-tooltip>

        <SettingColumns :columns="columns" />

        <el-tooltip effect="dark" content="密度" placement="top">
          <span style="cursor: pointer">
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
import { useTableActionContext, useTableStoreContext } from '../../store'
import { RefreshRight } from '@element-plus/icons-vue'
import SettingColumns from '../column-setting/column-setting.vue'
import { Density } from '../../../../icon'
import { ProTableProps } from '../../props'

const sizeTypes: {
  title: string
  size: ProTableProps['size']
}[] = [
  { title: '大', size: 'large' },
  { title: '默认', size: 'default' },
  { title: '小', size: 'small' }
]

defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  headerTitle: {
    type: String,
    default: ''
  }
})

const tableActions = useTableActionContext()

const { mergeTableProps } = useTableStoreContext()
</script>
