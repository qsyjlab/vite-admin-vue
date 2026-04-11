<script lang="ts">
import { defineComponent, h, unref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const router = useRouter()

    const { currentRoute, replace } = router

    const { query } = unref(currentRoute)
    const { path, _redirect_type = 'path', _origin_params, ...restQuery } = query
    const _path = Array.isArray(path) ? path.join('/') : (path ?? '')

    function parseJsonSafely(input?: string) {
      if (!input) return {}
      try {
        return JSON.parse(input)
      } catch {
        return {}
      }
    }

    if (_redirect_type === 'name' && _path) {
      replace({
        name: _path,
        query: restQuery,
        params: parseJsonSafely(_origin_params as string)
      })
    } else {
      replace({
        path: _path.startsWith('/') ? _path : '/' + _path,
        query: restQuery
      })
    }

    return () => h('div')
  }
})
</script>
