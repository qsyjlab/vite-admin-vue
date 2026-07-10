import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { compile } from '@vue/compiler-dom'
import { compileStyleAsync, parse } from '@vue/compiler-sfc'
import { createSSRApp } from 'vue'
import * as VueRuntime from 'vue'
import { renderToString } from '@vue/server-renderer'
import type { Component } from 'vue'
import type { Plugin as VitePlugin } from 'vite'

const appLoadingMarker = '<!-- app-loading -->'

interface AppLoadingPluginOptions {
  componentPath: string
  appTitle: string
  baseUrl: string
}

interface CompiledAppLoading {
  source: string
  html: string
  css: string
}

function resolvePublicAsset(baseUrl: string, assetPath: string) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBase}${assetPath.replace(/^\//, '')}`
}

export function appLoadingPlugin(options: AppLoadingPluginOptions): VitePlugin {
  const componentPath = resolve(options.componentPath)
  const scopeId = createHash('sha256').update(componentPath).digest('hex').slice(0, 8)
  let cache: CompiledAppLoading | undefined

  async function compileAppLoading() {
    const source = await readFile(componentPath, 'utf8')
    if (cache?.source === source) return cache

    const { descriptor, errors } = parse(source, { filename: componentPath })
    if (errors.length) {
      throw new Error(`[vite:app-loading] ${errors.map(String).join('\n')}`)
    }
    if (!descriptor.template) {
      throw new Error('[vite:app-loading] app-loading.vue requires a template block.')
    }

    const templateErrors: unknown[] = []
    const templateResult = compile(descriptor.template.content, {
      mode: 'function',
      prefixIdentifiers: true,
      hoistStatic: true,
      filename: componentPath,
      onError: error => templateErrors.push(error)
    })
    if (templateErrors.length) {
      throw new Error(`[vite:app-loading] ${templateErrors.map(String).join('\n')}`)
    }

    const render = new Function('Vue', templateResult.code)(VueRuntime)
    const component = {
      props: ['appTitle', 'logoUrl'],
      render,
      __scopeId: `data-v-${scopeId}`
    } as Component
    const props = {
      appTitle: options.appTitle,
      logoUrl: resolvePublicAsset(options.baseUrl || './', 'logo.svg')
    }
    const html = await renderToString(createSSRApp(component, props))

    const compiledStyles = await Promise.all(
      descriptor.styles.map(style =>
        compileStyleAsync({
          filename: componentPath,
          id: `data-v-${scopeId}`,
          source: style.content,
          scoped: style.scoped,
          preprocessLang: style.lang as 'scss' | undefined
        })
      )
    )
    const styleErrors = compiledStyles.flatMap(style => style.errors)
    if (styleErrors.length) {
      throw new Error(`[vite:app-loading] ${styleErrors.map(String).join('\n')}`)
    }

    cache = {
      source,
      html,
      css: compiledStyles.map(style => style.code).join('\n')
    }
    return cache
  }

  return {
    name: 'vite-admin:app-loading',
    enforce: 'pre',
    configureServer(server) {
      server.watcher.add(componentPath)
      server.watcher.on('change', changedPath => {
        if (resolve(changedPath) !== componentPath) return
        cache = undefined
        server.ws.send({ type: 'full-reload', path: '*' })
      })
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        if (!html.includes(appLoadingMarker)) {
          throw new Error(`[vite:app-loading] Missing marker ${appLoadingMarker} in index.html.`)
        }

        const compiled = await compileAppLoading()
        return {
          html: html.replace(appLoadingMarker, compiled.html),
          tags: [
            {
              tag: 'style',
              attrs: { id: 'app-loading-style' },
              children: compiled.css,
              injectTo: 'head'
            }
          ]
        }
      }
    }
  }
}
