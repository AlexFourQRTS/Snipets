<script setup lang="ts">
import { loadWASM } from 'onigasm'
import onigasmFile from 'onigasm/lib/onigasm.wasm?url'
import { Toaster } from 'vue-sonner'
import { useApp, useTheme } from '@/composables'
import { loadGrammars } from './components/editor/grammars'
import { registerIPCListeners } from './ipc'
import { notifications } from './services/notifications'
import ContextMenu from './components/ui/context-menu/ContextMenu.vue'

const { isSponsored } = useApp()
useTheme()

async function init() {
  registerIPCListeners()
  loadWASM(onigasmFile)
  await loadGrammars()
  notifications()
}

// Функции управления окном
function minimizeWindow() {
  window.electron?.window?.minimize()
}

function maximizeWindow() {
  window.electron?.window?.maximize()
}

function closeWindow() {
  window.electron?.window?.close()
}

init()
</script>

<template>
  <div
    data-title-bar
    class="absolute top-0 z-50 h-[var(--title-bar-height)] w-full select-none flex items-center justify-between px-4"
  >
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
    <div class="text-sm font-medium">Snipets New Gen</div>
    <div class="flex items-center space-x-2">
      <button
        class="w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
        @click="minimizeWindow"
        title="Свернуть"
      />
      <button
        class="w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
        @click="maximizeWindow"
        title="Развернуть"
      />
      <button
        class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        @click="closeWindow"
        title="Закрыть"
      />
    </div>
  </div>
  <!-- Removed sponsored message -->
  <div class="pt-[var(--title-bar-height)]">
    <RouterView />
  </div>
  <ContextMenu />
  <Toaster style="--width: 356px; --offset: 12px" />
</template>

<style>
[data-title-bar] {
  -webkit-app-region: drag;
  background-color: var(--color-bg-panel);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}
</style>
