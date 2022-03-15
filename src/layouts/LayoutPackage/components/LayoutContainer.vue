<!--
 * @Description: container 容器
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 10:55:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 13:30:58
 * @FilePath: \vite-admin-vue\src\layouts\LayoutPackage\components\LayoutContainer.vue
-->

<template>
    <div class="layout-container" v-bind="$attrs">
        <slot />
    </div>
</template>

<style scoped>
.layout-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>
