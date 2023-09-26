<template>
  <div class="default-handle">
    <span class="handle-icon"
      ><svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="holder"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M300 276.5a56 56 0 1056-97 56 56 0 00-56 97zm0 284a56 56 0 1056-97 56 56 0 00-56 97zM640 228a56 56 0 10112 0 56 56 0 00-112 0zm0 284a56 56 0 10112 0 56 56 0 00-112 0zM300 844.5a56 56 0 1056-97 56 56 0 00-56 97zM640 796a56 56 0 10112 0 56 56 0 00-112 0z"
        ></path></svg
    ></span>
  </div>
</template>

<style lang="scss" scoped>
.default-handle {
  display: flex;
  height: 100%;
  align-items: center;
}
.handle-icon {
  vertical-align: middle;
  padding: 4px;
  font-size: 12px;
  border-radius: 6px;
  vertical-align: -0.125em;
  cursor: pointer;
  &:hover {
    color: rgba(42, 46, 54, 0.88);
    background-color: #d3e7ff;
  }
}
</style>
