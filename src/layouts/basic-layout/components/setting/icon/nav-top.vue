<template>
  <div className="drawer-icon drawer-icon-top"></div>
</template>

<style lang="scss" scoped>
.drawer-icon {
  position: relative;
  width: 44px;
  height: 36px;
  border-radius: 4px;
  box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);
  background-color: #f0f2f5;
  overflow: hidden;
  cursor: pointer;

  &-top {
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 20%;
      background-color: #001529;
    }
  }
}
</style>
