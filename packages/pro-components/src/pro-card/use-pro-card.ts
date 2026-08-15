import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProCardInstance } from './pro-card'

export type ProCardTemplateRef = Readonly<ShallowRef<ProCardInstance | null>>

export function useProCard(templateRef?: ProCardTemplateRef) {
  const cardRef = templateRef ?? shallowRef<ProCardInstance | null>(null)

  async function getCard() {
    await nextTick()
    if (!cardRef.value) throw new Error('ProCard instance is not available')
    return cardRef.value
  }

  return {
    cardRef,
    getCard,
    async getCollapsed() {
      return (await getCard()).getCollapsed()
    },
    async setCollapsed(collapsed: boolean) {
      ;(await getCard()).setCollapsed(collapsed)
    },
    async toggleCollapse() {
      ;(await getCard()).toggleCollapse()
    }
  }
}
