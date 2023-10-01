import { withInstall } from '@/utils'

import { createTransition } from './src'

export const FadeTransition = withInstall(
  createTransition('FadeTransition', { name: 'fade-transition', mode: 'out-in' })
)
