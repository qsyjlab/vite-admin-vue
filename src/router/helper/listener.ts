import mitt from 'mitt'

import { RouteRecordNormalized, RouteLocationNormalized } from 'vue-router'
import { resolveMatched } from './matched'

interface RouteListenerParameter {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  matched: RouteRecordNormalized[]
}

type RouterListenderCallback = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  matched: RouteRecordNormalized[]
) => void

const routeListenerChangeKey = Symbol('Route Listener')

type EmitterEvents = {
  [routeListenerChangeKey]: RouteListenerParameter
}

const lastCache: Partial<RouteListenerParameter> = {
  to: undefined,
  from: undefined,
  matched: []
}

const emitter = mitt<EmitterEvents>()

export function routeChangeListener(callback: RouterListenderCallback, immediate = true) {
  const emitOnFn = (route: RouteListenerParameter) => {
    callback(route.to, route.from, route.matched)
  }
  emitter.on(routeListenerChangeKey, emitOnFn)

  if (immediate && lastCache.from && lastCache.to) {
    callback(lastCache.to, lastCache.from, lastCache.matched || [])
  }

  return () => {
    emitter.off(routeListenerChangeKey, emitOnFn)
  }
}

export function emitRoute(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  const matched = resolveMatched(to, from)

  emitter.emit(routeListenerChangeKey, {
    to,
    from,
    matched
  })

  lastCache.to = to
  lastCache.from = from
  lastCache.matched = matched
}
