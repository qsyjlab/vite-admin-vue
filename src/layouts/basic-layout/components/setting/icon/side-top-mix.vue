<template>
  <div className="drawer-icon drawer-icon-side-top"></div>
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
  &-side-top {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 33%;
      height: 100%;
      background-color: #001529;
      // z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      height: 20%;
      width: 100%;
      background-color: white;
    }
  }
}
</style>
