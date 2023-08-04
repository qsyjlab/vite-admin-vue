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
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTableActionContext } from '../../store'
import { RefreshRight } from '@element-plus/icons-vue'
import SettingColumns from '../column-setting/column-setting.vue'

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
</script>
