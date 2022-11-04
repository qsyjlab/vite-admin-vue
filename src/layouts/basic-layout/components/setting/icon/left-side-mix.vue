<template>
  <div className="drawer-icon drawer-icon-left-side-mix">
    <div className="drawer-icon-left-side-mix__side" />
  </div>
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

  &-left-side-mix {
    &__side {
      position: absolute;
      top: 0;
      width: 35%;
      background-color: white;
      height: 100%;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 15%;
      height: 100%;
      background-color: #001529;
      z-index: 1;
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
