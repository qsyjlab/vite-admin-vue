# ProEmpty / ProResult

`ProEmpty` 负责局部内容区域没有数据或无法展示的状态；`ProResult` 负责一次操作或整页流程的结果反馈。两者用途不同，不应互相替代。

## ProEmpty

```vue
<pro-empty status="search" title="没有符合条件的订单" action-text="清空筛选" @action="resetQuery" />
```

### Props

| 属性                                 | 说明                                    |
| ------------------------------------ | --------------------------------------- |
| `status`                             | `empty`、`search`、`error`、`forbidden` |
| `title` / `description`              | 主标题和说明                            |
| `image` / `imageSize`                | 自定义图片及尺寸                        |
| `compact`                            | 紧凑布局                                |
| `actionText` / `secondaryActionText` | 默认操作按钮文案                        |
| `bodyStyle`                          | 内容区样式                              |

事件为 `action`、`secondary-action`；插槽为 `image`、`title`、`description` 和 `extra`。

## ProResult

```vue
<pro-result
  status="success"
  title="订单创建成功"
  primary-text="查看订单"
  secondary-text="继续创建"
  @primary="openOrder"
  @secondary="createNext"
/>
```

### Props

| 属性                            | 说明                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `status`                        | `success`、`error`、`warning`、`info`、`403`、`404`、`500` |
| `title` / `subTitle`            | 结果标题和说明；未传时使用状态默认文案                     |
| `primaryText` / `secondaryText` | 默认操作按钮文案                                           |
| `bodyStyle`                     | 内容区样式                                                 |

事件为 `primary`、`secondary`；插槽为 `icon`、`title`、`subTitle`、默认内容和 `extra`。组件使用 `role="status"` 与 `aria-live="polite"`。

## 集成规则

| 场景                             | 使用组件                          |
| -------------------------------- | --------------------------------- |
| 表格、列表、详情、选择器没有数据 | `ProEmpty`                        |
| 搜索无结果                       | `ProEmpty status="search"`        |
| 首次请求失败且没有历史数据       | `ProEmpty status="error"`         |
| 刷新失败但存在历史数据           | 保留内容并显示 `ElAlert` 重试入口 |
| 403、404、500 页面               | `ProResult`                       |
| 发布、提交、审批等流程结果       | `ProResult`                       |
| 未选择预览文件                   | `ProEmpty`                        |
| 文件类型暂不支持预览             | `ProResult status="warning"`      |

当前 ProTable、ProList、ProDescriptions、ProSelect、ProTree、ProTreeSelect、ProUploadList 和 ProPreviewFile 已按上述规则接入；CRUD 页面复用组件自身空态和错误态，不重复维护页面级展示逻辑。
