import type { App } from 'vue'

type DefineAppPlugin = (install: (app: App) => void) => (app: App) => void

export const defineAppPlugin: DefineAppPlugin = install => install
