import type { ProCheckCardOption, ProCheckCardValue } from './pro-check-card'

export type ProCheckCardNavigationKey =
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Home'
  | 'End'

export function getInitialProCheckCardIndex<TValue extends ProCheckCardValue>(
  options: ProCheckCardOption<TValue>[],
  value: TValue | TValue[] | undefined,
  multiple: boolean
) {
  if (!multiple && value !== undefined && !Array.isArray(value)) {
    const selectedIndex = options.findIndex(
      option => option.value === value && isProCheckCardOptionEnabled(option)
    )
    if (selectedIndex >= 0) return selectedIndex
  }
  return options.findIndex(isProCheckCardOptionEnabled)
}

export function getNextProCheckCardIndex<TValue extends ProCheckCardValue>(
  options: ProCheckCardOption<TValue>[],
  currentIndex: number,
  key: ProCheckCardNavigationKey
) {
  if (!options.length) return -1
  if (key === 'Home') return options.findIndex(isProCheckCardOptionEnabled)
  if (key === 'End') return findLastEnabledIndex(options)

  const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1
  let index = currentIndex >= 0 ? currentIndex : direction > 0 ? -1 : 0
  for (let visited = 0; visited < options.length; visited += 1) {
    index = (index + direction + options.length) % options.length
    if (isProCheckCardOptionEnabled(options[index]!)) return index
  }
  return -1
}

export function isProCheckCardOptionEnabled(option: ProCheckCardOption) {
  return !option.disabled && !option.loading
}

function findLastEnabledIndex(options: ProCheckCardOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (isProCheckCardOptionEnabled(options[index]!)) return index
  }
  return -1
}
