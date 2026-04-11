# Route Modules

## Directory

- `base-routes.ts`: static routes (login, root, error, redirect)
- `module-routes.ts`: dynamic loader for `modules/**`
- `modules/core/*`: core business routes
- `modules/showcase/*`: UI/features showcase routes
- `modules/examples/*`: architecture and migration examples

## Recommended API

Use `defineRoutes` or `defineRoute` from `@/router`.

```ts
import { defineRoutes } from '@/router'

export default defineRoutes([
  {
    name: 'Demo',
    path: '/demo',
    children: [
      {
        name: 'DemoIndex',
        path: 'index',
        component: () => import('@/views/demo/index.vue')
      }
    ]
  }
])
```

`defineRoutes` will automatically:

- inject `Layout` for root nodes with children
- inject `BlankContainer` for nested group nodes
- infer redirect to first visible child if missing

So route declaration stays close to native `RouteRecordRaw` and avoids placeholder components.
