<template>
  <component
    :is="epIconMap[icon]"
    v-if="icon && epIconMap[icon]"
    class="pro-ep-icon"
    :style="iconStyle"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChatDotRound,
  CircleClose,
  Close,
  Coin,
  CollectionTag,
  Connection,
  CopyDocument,
  DataLine,
  Document,
  DocumentAdd,
  DocumentCopy,
  Download,
  Edit,
  EditPen,
  Expand,
  Files,
  Finished,
  FolderOpened,
  Grid,
  Guide,
  HomeFilled,
  InfoFilled,
  Link,
  List,
  Lock,
  Memo,
  Menu,
  Monitor,
  MoreFilled,
  Operation,
  Orange,
  Open,
  Picture,
  Pointer,
  Position,
  Postcard,
  Printer,
  Rank,
  Refresh,
  RefreshRight,
  Setting,
  Share,
  Select,
  Stopwatch,
  Tickets,
  Timer,
  TrendCharts,
  Upload,
  UploadFilled,
  View,
  Warning,
  WarningFilled
} from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    icon?: string
    size?: number
    color?: string
  }>(),
  {
    size: 24
  }
)

const epIconMap: Record<string, any> = {
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chat-dot-round': ChatDotRound,
  'circle-close': CircleClose,
  close: Close,
  coin: Coin,
  'collection-tag': CollectionTag,
  connection: Connection,
  'copy-document': CopyDocument,
  'data-line': DataLine,
  document: Document,
  'document-add': DocumentAdd,
  'document-copy': DocumentCopy,
  download: Download,
  edit: Edit,
  'edit-pen': EditPen,
  expand: Expand,
  files: Files,
  finished: Finished,
  'folder-opened': FolderOpened,
  grid: Grid,
  guide: Guide,
  'home-filled': HomeFilled,
  'info-filled': InfoFilled,
  link: Link,
  list: List,
  lock: Lock,
  memo: Memo,
  menu: Menu,
  monitor: Monitor,
  'more-filled': MoreFilled,
  operation: Operation,
  orange: Orange,
  open: Open,
  picture: Picture,
  pointer: Pointer,
  position: Position,
  postcard: Postcard,
  printer: Printer,
  rank: Rank,
  refresh: Refresh,
  'refresh-right': RefreshRight,
  setting: Setting,
  share: Share,
  select: Select,
  stopwatch: Stopwatch,
  tickets: Tickets,
  timer: Timer,
  'trend-charts': TrendCharts,
  upload: Upload,
  'upload-filled': UploadFilled,
  view: View,
  warning: Warning,
  'warning-filled': WarningFilled
}

const iconStyle = computed<CSSProperties>(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    color: props.color
  }
})
</script>

<style lang="scss" scoped>
.pro-ep-icon {
  display: block;
  flex: 0 0 auto;
  fill: currentcolor;
}
</style>
