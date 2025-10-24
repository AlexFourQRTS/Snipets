<script setup lang="ts">
import type { SelectLabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { SelectLabel } from 'radix-vue'
import { cn } from '@/utils'

const props = defineProps<
  SelectLabelProps & { class?: HTMLAttributes['class'] }
>()
</script>

<template>
  <SelectLabel
    :class="
      cn('text-text-muted py-0.5 pr-2 pl-8 text-xs font-semibold', props.class)
    "
  >
    <slot />
  </SelectLabel>
</template>
