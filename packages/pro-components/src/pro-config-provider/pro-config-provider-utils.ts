export function resolveProConfigProviderPopperClass(dark: boolean | undefined, className?: string) {
  return [className, dark ? 'pro-config-provider-popper--dark' : ''].filter(Boolean).join(' ')
}
