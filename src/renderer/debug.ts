// Debug utility to check application initialization
export function debugApp() {
  console.log('=== massCode Debug Info ===')

  // Check if electron is available
  console.log('window.electron:', !!window.electron)

  if (window.electron) {
    console.log('IPC available:', !!window.electron.ipc)
    console.log('Store available:', !!window.electron.store)
    console.log('DB available:', !!window.electron.db)
    console.log('i18n available:', !!window.electron.i18n)

    // Test store access
    try {
      const storagePath = window.electron.store.preferences.get('storagePath')
      console.log('Storage path:', storagePath)
    }
    catch (error) {
      console.error('Store access error:', error)
    }

    // Test i18n
    try {
      const testTranslation = window.electron.i18n.t('menu:app.label')
      console.log('i18n test:', testTranslation)
    }
    catch (error) {
      console.error('i18n error:', error)
    }
  }

  // Check Vue app
  console.log('Vue app mounted:', !!document.getElementById('app'))

  // Check router
  console.log('Router available:', !!window.__VUE_ROUTER__)

  console.log('=== End Debug Info ===')
}

// Auto-run debug on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(debugApp, 1000)
  })
}
