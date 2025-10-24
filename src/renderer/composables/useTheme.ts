import { useColorMode } from '@vueuse/core'
import { store } from '@/electron'

const storedTheme = store.preferences.get('theme')
const { store: theme } = useColorMode()

// Set dark theme as default if no theme is stored
theme.value = storedTheme || 'dark'

watch(theme, (v) => {
  store.preferences.set('theme', v)
})

export function useTheme() {
  return {
    theme,
  }
}
