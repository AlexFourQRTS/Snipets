import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const variants = cva(
  'inline-flex items-center justify-center rounded-lg cursor-pointer focus-visible:outline-none leading-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out font-medium',
  {
    variants: {
      variant: {
        default: 'bg-button text-button-fg hover:bg-button-hover hover:shadow-sm border border-border hover:border-border-hover',
        primary: 'bg-primary text-white hover:bg-primary-hover hover:shadow-md shadow-sm',
        danger: 'bg-error text-white hover:bg-error/90 hover:shadow-md shadow-sm',
        success: 'bg-success text-white hover:bg-success/90 hover:shadow-md shadow-sm',
        warning: 'bg-warning text-white hover:bg-warning/90 hover:shadow-md shadow-sm',
        info: 'bg-info text-white hover:bg-info/90 hover:shadow-md shadow-sm',
        ghost: 'bg-transparent text-text hover:bg-button-hover hover:text-button-fg',
        icon: 'bg-transparent hover:bg-button-hover hover:[&>svg]:text-button-fg hover:text-button-fg [&>svg]:text-button-fg rounded-md',
        outline: 'border border-border text-text hover:bg-button-hover hover:border-border-hover',
      },
      size: {
        xs: 'px-2 h-6 text-xs',
        sm: 'px-3 h-7 text-sm',
        md: 'px-4 h-8 text-sm',
        lg: 'px-6 h-10 text-base',
        icon: 'h-8 w-8',
        iconSm: 'h-6 w-6',
        iconLg: 'h-10 w-10',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
)

export type Variants = VariantProps<typeof variants>
