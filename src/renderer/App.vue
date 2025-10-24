<script setup lang="ts">
import { loadWASM } from 'onigasm'
import onigasmFile from 'onigasm/lib/onigasm.wasm?url'
import { Toaster } from 'vue-sonner'
import { useApp, useTheme } from '@/composables'
import { loadGrammars } from './components/editor/grammars'
import { registerIPCListeners } from './ipc'
import { notifications } from './services/notifications'

const { isSponsored } = useApp()
useTheme()

async function init() {
  registerIPCListeners()
  loadWASM(onigasmFile)
  await loadGrammars()
  notifications()
}


init()
</script>

<template>
  <!-- Removed sponsored message -->
  <div class="min-h-screen">
    <RouterView />
  </div>
  <Toaster style="--width: 356px; --offset: 12px" />
</template>

