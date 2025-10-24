import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const variants = cva(
  'w-full rounded-lg focus:outline-none placeholder:text-text-muted py-2 px-3 border transition-all duration-200 ease-in-out [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  {
    variants: {
      variant: {
        default: 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-bg hover:border-border-hover',
        ghost: 'border-transparent focus:border-transparent !bg-transparent hover:bg-button-hover',
        filled: 'border-transparent bg-button focus:bg-button-hover focus:ring-2 focus:ring-primary/20',
        error: 'border-error focus:border-error focus:ring-2 focus:ring-error/20',
        success: 'border-success focus:border-success focus:ring-2 focus:ring-success/20',
      },
      size: {
        sm: 'py-1.5 px-2 text-sm',
        md: 'py-2 px-3 text-sm',
        lg: 'py-3 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export type Variants = VariantProps<typeof variants>
