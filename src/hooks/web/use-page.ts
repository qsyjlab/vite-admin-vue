import { REDIRECT_NAME } from '@/router/constant'
import { unref } from 'vue'
import { useRouter } from 'vue-router'

export function useReloadPage() {
  const { replace, currentRoute } = useRouter()

  function reload() {
    const { query, params = {}, path, name } = unref(currentRoute)
    if (name === REDIRECT_NAME) {
      return Promise.resolve(false)
    }

    const redirectQuery: Record<string, any> = {}

    if (name && Object.keys(params).length > 0) {
      redirectQuery['_origin_params'] = JSON.stringify(params ?? {})
      redirectQuery['_redirect_type'] = 'name'
      redirectQuery['path'] = String(name)
    } else {
      redirectQuery['_redirect_type'] = 'path'
      redirectQuery['path'] = path
    }

    return replace({
      name: REDIRECT_NAME,
      query: {
        ...query,
        ...redirectQuery
      }
    }).then(() => Promise.resolve(true))
  }

  return {
    reload
  }
}
