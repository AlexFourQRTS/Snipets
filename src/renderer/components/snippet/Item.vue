<script setup lang="ts">
import type { SnippetsResponse } from '@/services/api/generated'
import { onClickOutside, useClipboard } from '@vueuse/core'
import { format } from 'date-fns'
import * as ContextMenu from '@/components/ui/shadcn/context-menu'
import { useApp, useDialog, useSnippets } from '@/composables'
import { LibraryFilter } from '@/composables/types'
import { i18n } from '@/electron'

interface Props {
  snippet: SnippetsResponse[0]
}

const props = defineProps<Props>()

const {
  highlightedSnippetIds,
  highlightedFolderId,
  isFocusedSnippetName,
  focusedSnippetId,
  state,
} = useApp()

const {
  selectSnippet,
  selectFirstSnippet,
  duplicateSnippet,
  selectedSnippetIds,
  updateSnippet,
  updateSnippets,
  deleteSnippet,
  deleteSnippets,
  displayedSnippets,
} = useSnippets()

const { confirm } = useDialog()
const { copy } = useClipboard()

const snippetRef = ref<HTMLDivElement>()

const isSelected = computed(() => state.snippetId === props.snippet.id)

const isInMultiSelection = computed(
  () =>
    selectedSnippetIds.value.length > 1
    && selectedSnippetIds.value.includes(props.snippet.id),
)
const isHighlighted = computed(() =>
  highlightedSnippetIds.value.has(props.snippet.id),
)

const isFocused = computed(() => focusedSnippetId.value === props.snippet.id)

const isDuplicateDisabled = computed(
  () => highlightedSnippetIds.value.size > 1,
)

const isFavoritesLibrarySelected = computed(
  () => state.libraryFilter === LibraryFilter.Favorites,
)

const isTrashLibrarySelectd = computed(
  () => state.libraryFilter === LibraryFilter.Trash,
)

const folderName = computed(() => {
  if (props.snippet.folder) {
    return props.snippet.folder.name
  }

  if (props.snippet.isDeleted) {
    return i18n.t('sidebar.trash')
  }

  return i18n.t('sidebar.inbox')
})

function onSnippetClick(id: number, event: MouseEvent) {
  selectSnippet(id, event.shiftKey)
  focusedSnippetId.value = id
}

function onClickContextMenu() {
  highlightedFolderId.value = undefined
  highlightedSnippetIds.value.clear()
  highlightedSnippetIds.value.add(props.snippet.id)

  if (selectedSnippetIds.value.length > 1) {
    selectedSnippetIds.value.forEach(id =>
      highlightedSnippetIds.value.add(id),
    )
  }
}

async function onAddFavorites() {
  const isFavorites = isFavoritesLibrarySelected.value ? 0 : 1

  if (selectedSnippetIds.value.length > 1) {
    const snippetsData = selectedSnippetIds.value?.map(() => ({ isFavorites }))
    await updateSnippets(selectedSnippetIds.value, snippetsData)
  }
  else {
    await updateSnippet(props.snippet.id, { isFavorites })
  }
  if (isFavoritesLibrarySelected.value) {
    if (
      selectedSnippetIds.value.length > 1
      || state.snippetId === props.snippet.id
    ) {
      selectFirstSnippet()
    }
  }
}

async function onDelete() {
  if (selectedSnippetIds.value.length > 1) {
    const isAllSoftDeleted = displayedSnippets.value?.every(s => s.isDeleted)

    if (isAllSoftDeleted) {
      const isConfirmed = await confirm({
        title: i18n.t('messages:confirm.deleteConfirmMultipleSnippets', {
          count: selectedSnippetIds.value.length,
        }),
        content: i18n.t('messages:warning.noUndo'),
      })

      if (isConfirmed) {
        await deleteSnippets(selectedSnippetIds.value)
      }
    }
    else {
      // Мягкое удаление
      const snippetsData = selectedSnippetIds.value?.map(() => ({
        folderId: null,
        isDeleted: 1,
      }))

      await updateSnippets(selectedSnippetIds.value, snippetsData)
    }
  }
  else if (props.snippet.isDeleted) {
    const isConfirmed = await confirm({
      title: i18n.t('messages:confirm.deletePermanently', {
        name: props.snippet.name,
      }),
      content: i18n.t('messages:warning.noUndo'),
    })

    if (isConfirmed) {
      await deleteSnippet(props.snippet.id)
    }
  }
  else {
    // Мягкое удаление
    await updateSnippet(props.snippet.id, {
      folderId: null,
      isDeleted: 1,
    })
  }

  if (
    selectedSnippetIds.value.length > 1
    || state.snippetId === props.snippet.id
  ) {
    selectFirstSnippet()
  }
}

async function onRestore() {
  if (selectedSnippetIds.value.length > 1) {
    const snippetsData = selectedSnippetIds.value?.map(() => ({
      folderId: null,
      isDeleted: 0,
    }))

    await updateSnippets(selectedSnippetIds.value, snippetsData)
  }
  else {
    await updateSnippet(props.snippet.id, {
      folderId: null,
      isDeleted: 0,
    })
  }
}

async function onDuplicate() {
  await duplicateSnippet(props.snippet.id)
  selectFirstSnippet()
  isFocusedSnippetName.value = true
}

function onCopySnippetLink() {
  // copy(`masscode://folder/${state.folderId}/snippet/${props.snippet.id}`)
  copy(
    `masscode://goto?folderId=${state.folderId}&snippetId=${props.snippet.id}`,
  )
}

function getLanguageClass(language: string) {
  const langMap: Record<string, string> = {
    'javascript': 'javascript',
    'typescript': 'javascript',
    'react': 'react',
    'jsx': 'react',
    'tsx': 'react',
    'python': 'python',
    'sql': 'sql',
    'css': 'css',
    'html': 'html',
    'vue': 'react', // Используем React цвет для Vue
    'node': 'javascript',
    'nodejs': 'javascript',
  }
  
  return langMap[language?.toLowerCase()] || 'default'
}

function getLanguageName(language: string) {
  const nameMap: Record<string, string> = {
    'javascript': 'JS',
    'typescript': 'TS',
    'react': 'React',
    'jsx': 'JSX',
    'tsx': 'TSX',
    'python': 'Python',
    'sql': 'SQL',
    'css': 'CSS',
    'html': 'HTML',
    'vue': 'Vue',
    'node': 'Node',
    'nodejs': 'Node',
  }
  
  return nameMap[language?.toLowerCase()] || language?.toUpperCase() || 'TXT'
}

function onDragStart(event: DragEvent) {
  const ids
    = selectedSnippetIds.value.length > 1
      ? selectedSnippetIds.value
      : [props.snippet.id]

  event.dataTransfer?.setData('snippetIds', JSON.stringify(ids))

  const el = document.createElement('div')

  if (selectedSnippetIds.value.length > 1) {
    el.className
      = 'fixed left-[-100%] text-fg truncate max-w-[200px] flex items-center'
    el.id = 'ghost'
    el.innerHTML = `
      <span class="rounded-full bg-primary text-white px-2 py-0.5 text-xs ml-3">
        ${selectedSnippetIds.value.length}
      </span>
    `
  }
  else {
    el.className = 'fixed left-[-100%] text-fg truncate max-w-[200px]'
    el.id = 'ghost'
    el.innerHTML = props.snippet.name
  }

  document.body.appendChild(el)
  event.dataTransfer?.setDragImage(el, 0, 0)

  setTimeout(() => el.remove(), 0)
}

onClickOutside(snippetRef, () => {
  focusedSnippetId.value = undefined
  highlightedSnippetIds.value.clear()
})
</script>

<template>
  <div
    ref="snippetRef"
    data-snippet-item
    class="border-border relative mx-2 my-1 rounded-lg border transition-all duration-200 ease-in-out focus-visible:outline-none hover:shadow-sm card-hover list-item"
    :class="{
      'is-selected': isSelected,
      'is-multi-selected': isInMultiSelection,
      'is-focused': isFocused,
      'is-highlighted': isHighlighted,
    }"
    draggable="true"
    @click="(event) => onSnippetClick(snippet.id, event)"
    @contextmenu="onClickContextMenu"
    @dragstart.stop="onDragStart"
  >
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div class="flex flex-col p-3 select-none">
          <div class="flex items-start justify-between mb-2">
            <div
              class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm"
            >
              {{ snippet.name || i18n.t("snippet.untitled") }}
            </div>
            <div v-if="snippet.isFavorites" class="ml-2 flex-shrink-0">
              <div class="w-2 h-2 bg-warning rounded-full"></div>
            </div>
          </div>
          <div class="meta text-text-muted flex justify-between items-center text-xs">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 bg-button rounded-full text-xs">
                {{ folderName }}
              </span>
              <span 
                v-if="snippet.contents && snippet.contents[0]"
                class="tag-language"
                :class="getLanguageClass(snippet.contents[0].language)"
              >
                {{ getLanguageName(snippet.contents[0].language) }}
              </span>
            </div>
            <div class="text-xs opacity-75">
              {{ format(new Date(snippet.createdAt), "dd.MM.yyyy") }}
            </div>
          </div>
          <div v-if="snippet.description" class="mt-2 text-xs text-text-muted line-clamp-2">
            {{ snippet.description }}
          </div>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <template v-if="!isTrashLibrarySelectd">
          <ContextMenu.Item @click="onAddFavorites">
            {{
              isFavoritesLibrarySelected
                ? i18n.t("action.remove.fromFavorites")
                : i18n.t("action.add.toFavorites")
            }}
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item @click="onCopySnippetLink">
            {{ i18n.t("action.copy.snippetLink") }}
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item
            :disabled="isDuplicateDisabled"
            @click="onDuplicate"
          >
            {{ i18n.t("action.duplicate") }}
          </ContextMenu.Item>
        </template>
        <ContextMenu.Item @click="onDelete">
          {{
            state.libraryFilter === LibraryFilter.Trash
              ? i18n.t("action.delete.common")
              : i18n.t("action.move.toTrash")
          }}
        </ContextMenu.Item>
        <ContextMenu.Item
          v-if="isTrashLibrarySelectd"
          @click="onRestore"
        >
          {{ i18n.t("action.restore") }}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  </div>
</template>

<style lang="scss">
@reference "../../styles.css";

[data-snippet-item] {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: background-color 0.15s ease;
  
  &:hover {
    /* Минимальный hover - только изменение фона */
    background-color: var(--color-list-selection);
  }
  
  &.is-selected {
    background-color: var(--color-list-selection);
    border-left: 3px solid var(--color-primary);
    padding-left: 9px;
    color: var(--color-list-selection-fg);
    
    .meta {
      color: var(--color-list-selection-fg);
    }
  }
  
  &.is-multi-selected {
    background-color: var(--color-list-selection);
    opacity: 0.8;
    color: var(--color-list-selection-fg);
    
    .meta {
      color: var(--color-list-selection-fg);
    }
  }
  
  &.is-focused:not(.is-multi-selected) {
    background-color: var(--color-list-focus);
    color: var(--color-list-focus-fg);
    border-color: var(--color-primary);
    
    .meta {
      color: var(--color-list-focus-fg);
    }
  }
  
  &.is-highlighted {
    outline: 2px solid var(--color-list-focus);
    outline-offset: -2px;
    
    &.is-focused,
    &.is-selected,
    &.is-multi-selected {
      background-color: var(--color-bg);
      color: var(--color-list-selection-fg);
      
      .meta {
        color: var(--color-list-selection-fg);
      }
    }
  }
}

/* Стили для тегов языков */
.tag-language {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  color: #000;
  
  &.react { background-color: var(--color-tag-react); }
  &.javascript { background-color: var(--color-tag-js); }
  &.python { background-color: var(--color-tag-python); }
  &.sql { background-color: var(--color-tag-sql); }
  &.css { background-color: var(--color-tag-css); }
  &.html { background-color: var(--color-tag-html); }
  &.default { 
    background-color: var(--color-text-muted); 
    color: var(--color-bg);
  }
}
</style>
