<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Plus, Search, FolderPlus, Copy, Code, Eye, Settings, Terminal } from 'lucide-vue-next'
import { useApp } from '@/composables'
import { i18n, ipc } from '@/electron'

console.log('ContextMenu component loaded')

interface MenuItem {
  id: string
  label: string
  accelerator?: string
  role?: string
  click?: () => void
  separator?: boolean
  disabled?: boolean
  icon?: any
}

const { state } = useApp()

const isVisible = ref(false)
const position = ref({ x: 0, y: 0 })

// Основные пункты меню
const menuItems = computed<MenuItem[]>(() => [
  // File
  {
    id: 'new-snippet',
    label: i18n.t('action.new.snippet'),
    accelerator: 'Ctrl+N',
    icon: Plus,
    click: () => ipc.send('main-menu:new-snippet')
  },
  {
    id: 'new-fragment',
    label: i18n.t('action.new.fragment'),
    accelerator: 'Ctrl+T',
    icon: Code,
    click: () => ipc.send('main-menu:new-fragment')
  },
  {
    id: 'new-folder',
    label: i18n.t('action.new.folder'),
    accelerator: 'Ctrl+Shift+N',
    icon: FolderPlus,
    click: () => ipc.send('main-menu:new-folder')
  },
  { separator: true },
  
  // Edit
  {
    id: 'find',
    label: i18n.t('menu:edit.find'),
    accelerator: 'Ctrl+F',
    icon: Search,
    click: () => ipc.send('main-menu:find')
  },
  { separator: true },
  
  // View
  {
    id: 'toggle-sidebar',
    label: i18n.t('menu:view.showSidebar'),
    accelerator: 'Alt+Ctrl+B',
    icon: Eye,
    click: () => ipc.send('main-menu:toggle-sidebar')
  },
  { separator: true },
  
  // Editor
  {
    id: 'copy-snippet',
    label: i18n.t('menu:editor.copy'),
    accelerator: 'Ctrl+Shift+C',
    icon: Copy,
    click: () => ipc.send('main-menu:copy-snippet')
  },
  {
    id: 'format',
    label: i18n.t('menu:editor.format'),
    accelerator: 'Shift+Ctrl+F',
    icon: Code,
    click: () => ipc.send('main-menu:format')
  },
  {
    id: 'preview-code',
    label: i18n.t('menu:editor.previewCode'),
    accelerator: 'Alt+Ctrl+P',
    icon: Eye,
    click: () => ipc.send('main-menu:preview-code')
  },
  { separator: true },
  
  // Markdown
  {
    id: 'preview-markdown',
    label: i18n.t('menu:markdown.preview'),
    accelerator: 'Ctrl+Shift+M',
    icon: Eye,
    click: () => ipc.send('main-menu:preview-markdown')
  },
  {
    id: 'preview-mindmap',
    label: i18n.t('menu:markdown.previewMindmap'),
    accelerator: 'Ctrl+Shift+I',
    icon: Eye,
    click: () => ipc.send('main-menu:preview-mindmap')
  },
  { separator: true },
  
  // App
  {
    id: 'preferences',
    label: i18n.t('menu:app.preferences'),
    accelerator: 'Ctrl+,',
    icon: Settings,
    click: () => ipc.send('main-menu:goto-preferences')
  },
  {
    id: 'devtools',
    label: i18n.t('menu:app.devtools'),
    accelerator: 'Ctrl+.',
    icon: Terminal,
    click: () => ipc.send('main-menu:goto-devtools')
  }
])

function showMenu(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  console.log('Context menu triggered', event.type, event.target)
  
  // Позиционируем меню так, чтобы оно не выходило за границы экрана
  const x = Math.min(event.clientX, window.innerWidth - 200)
  const y = Math.min(event.clientY, window.innerHeight - 300)
  
  position.value = { x, y }
  isVisible.value = true
  console.log('Context menu shown at:', { x, y })
}

function hideMenu() {
  isVisible.value = false
}

function handleItemClick(item: MenuItem) {
  if (item.click) {
    item.click()
  }
  hideMenu()
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('[data-context-menu]')) {
    hideMenu()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    hideMenu()
  }
}

function handleLeftClick(event: MouseEvent) {
  // Показываем меню при левом клике на пустое поле
  console.log('Left click detected', event.target)
  showMenu(event)
}

onMounted(() => {
  console.log('ContextMenu mounted, adding event listeners')
  document.addEventListener('contextmenu', showMenu)
  document.addEventListener('click', handleLeftClick)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  console.log('ContextMenu unmounted, removing event listeners')
  document.removeEventListener('contextmenu', showMenu)
  document.removeEventListener('click', handleLeftClick)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="isVisible"
    data-context-menu
    class="fixed z-50 min-w-48 rounded-lg border border-border bg-bg-panel shadow-lg"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      maxHeight: '80vh',
      overflowY: 'auto'
    }"
  >
    <div class="py-1">
      <button
        v-for="item in menuItems"
        :key="item.id"
        v-if="!item.separator"
        class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-list-selection"
        :disabled="item.disabled"
        @click="handleItemClick(item)"
      >
        <div class="flex items-center space-x-2">
          <component
            v-if="item.icon"
            :is="item.icon"
            class="h-4 w-4 text-text-muted"
          />
          <span>{{ item.label }}</span>
        </div>
        <span v-if="item.accelerator" class="text-xs text-text-muted">
          {{ item.accelerator }}
        </span>
      </button>
      <div
        v-else
        class="my-1 border-t border-border"
      />
    </div>
  </div>
</template>
