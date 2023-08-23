import { REDIRECT_NAME } from '@/router/constant'
import { unref } from 'vue'
import { useRouter } from 'vue-router'

export function useReloadPage() {
  const { replace, currentRoute } = useRouter()

  const { query, params = {}, fullPath, name } = unref(currentRoute)

  function reload() {
    if (name === REDIRECT_NAME) {
      return Promise.resolve(false)
    }

    const _params: Record<string, any> = { ...params }

    if (name && Object.keys(params).length > 0) {
      _params['_origin_params'] = JSON.stringify(params ?? {})
      _params['_redirect_type'] = 'name'
      _params['path'] = String(name)
    } else {
      _params['_redirect_type'] = 'path'
      _params['path'] = fullPath
    }

    return replace({
      name: REDIRECT_NAME,
      params: _params,
      query
    }).then(() => Promise.resolve(true))
  }

  return {
    reload
  }
}
