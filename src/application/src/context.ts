import type { InjectionKey, Ref } from 'vue'
import { createContext, useContext } from '@/hooks/core/use-context'
import type { ProjectConfig } from '@/config/project-setting'
export interface AppProviderContextProps {
  isMobile: Ref<boolean>
  projectConfig: ProjectConfig
}

const key: InjectionKey<AppProviderContextProps> = Symbol()

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key)
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key)
}
