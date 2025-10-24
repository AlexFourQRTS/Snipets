<script setup lang="ts">
import type { PerfectScrollbarExpose } from 'vue3-perfect-scrollbar'
import { Plus } from 'lucide-vue-next'
import { useApp, useGutter, useSnippets } from '@/composables'
import { i18n, store } from '@/electron'
import { APP_DEFAULTS } from '~/main/store/constants'

const listRef = ref<HTMLElement>()
const gutterRef = ref<{ $el: HTMLElement }>()
const scrollbarRef = ref<PerfectScrollbarExpose | null>(null)

const { snippetListWidth } = useApp()
const { displayedSnippets, createSnippetAndSelect } = useSnippets()

// Оптимизация рендеринга для больших списков
const visibleSnippets = computed(() => {
  if (!displayedSnippets.value || displayedSnippets.value.length <= 100) {
    return displayedSnippets.value
  }
  
  // Для больших списков показываем только первые 100 элементов
  // В реальном приложении здесь должна быть виртуализация
  return displayedSnippets.value.slice(0, 100)
})

const { width } = useGutter({
  target: listRef,
  gutter: gutterRef,
  orientation: 'vertical',
  options: {
    minWidth: APP_DEFAULTS.sizes.snippetList,
  },
})

watch(width, () => {
  snippetListWidth.value = `${width.value}px`
  store.app.set('sizes.snippetListWidth', width.value)
})

watch(displayedSnippets, () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      scrollbarRef.value.ps?.update()
    }
  })
})
</script>

<template>
  <div
    ref="listRef"
    data-snippets-list
    class="relative flex h-screen flex-col"
  >
    <div>
      <SnippetHeader />
    </div>
    <PerfectScrollbar
      v-if="displayedSnippets?.length"
      ref="scrollbarRef"
      :options="{ minScrollbarLength: 20, suppressScrollX: true }"
    >
      <div class="flex-grow overflow-y-auto px-2">
        <SnippetItem
          v-for="snippet in visibleSnippets"
          :key="snippet.id"
          :snippet="snippet"
        />
      </div>
    </PerfectScrollbar>
    <div
      v-else
      class="flex flex-col items-center justify-center h-full space-y-4"
    >
      <div class="text-text-muted text-center">
        {{ i18n.t('placeholder.emptySnippetsList') }}
      </div>
      <UiButton
        variant="primary"
        size="md"
        @click="createSnippetAndSelect"
      >
        <Plus class="h-4 w-4 mr-2" />
        {{ i18n.t('action.new.snippet') }}
      </UiButton>
    </div>
    <UiGutter ref="gutterRef" />
  </div>
</template>
