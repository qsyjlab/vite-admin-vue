import Logo from './logo.vue'

export { Logo }
export interface LogoProps {
  logoWidth?: number
  showTitle?: boolean
  height?: number
  width?: number
  transitionDuration?: number
  transitionTimingFunction?: string
}
