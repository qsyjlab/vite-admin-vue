# 路由刷新

## 实现

```ts
import { useRedo } from '@/hooks/web/use-page'
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const { reload } = useReloadPage()
    reload()
  }
})
```

## Redirect

使用重定向方式来实现

`/src/views/redirect/redirect.vue`

```vue
<script lang="ts">
import { defineComponent, h, unref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const router = useRouter()

    const { currentRoute, replace } = router

    const { params = {}, query } = unref(currentRoute)
    const { path, _redirect_type = 'path' } = params

    Reflect.deleteProperty(params, '_redirect_type')
    Reflect.deleteProperty(params, 'path')

    const _path = Array.isArray(path) ? path.join('/') : path

    if (_redirect_type === 'name') {
      replace({
        name: _path,
        query,
        params: JSON.parse((params._origin_params as string) ?? '{}')
      })
    } else {
      replace({
        path: _path.startsWith('/') ? _path : '/' + _path,
        query
      })
    }

    return () => h('div')
  }
})
</script>
```

::: info 提示
这种方式如果当前的组件被缓存，是不会走开始的生命周期,所以要在缓存钩子来处理
:::
