import { type Directive, ref, nextTick } from 'vue'
import { useWaterMark, type WatermarkProps } from '@/components/watermark/src/use-watermark'

/**
 * 水印指令
 */

export const WatermarkDirective: Directive<HTMLElement, WatermarkProps> = (el, binding) => {
  const { render, destroy } = useWaterMark(el, ref({ ...binding.value }))

  destroy()
  nextTick(() => {
    render()
  })
}
