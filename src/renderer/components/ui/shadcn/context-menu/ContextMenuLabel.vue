<script setup lang="ts">
import { ContextMenuLabel, type ContextMenuLabelProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/utils'

const props = defineProps<
  ContextMenuLabelProps & { class?: HTMLAttributes['class'], inset?: boolean }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ContextMenuLabel
    v-bind="delegatedProps"
    :class="
      cn(
        'text-text-muted px-2 py-0.5 text-xs font-semibold',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot />
  </ContextMenuLabel>
</template>
