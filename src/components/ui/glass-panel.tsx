import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const glassPanelVariants = tv({
	base: 'glass-panel glass-inner-glow rounded-xl',
	variants: {
		variant: {
			default: 'bg-surface',
			elevated: 'glass-elevated',
			subtle: 'border-border bg-surface/70 shadow-glass-soft',
		},
		padding: {
			none: 'p-0',
			sm: 'p-3',
			md: 'p-4',
			lg: 'p-5',
		},
	},
	defaultVariants: {
		variant: 'default',
		padding: 'md',
	},
})

export interface GlassPanelProps
	extends ComponentProps<'div'>,
		VariantProps<typeof glassPanelVariants> {}

export function GlassPanel({
	className,
	variant,
	padding,
	children,
	...props
}: GlassPanelProps) {
	return (
		<div
			data-slot="glass-panel"
			className={twMerge(glassPanelVariants({ variant, padding }), className)}
			{...props}
		>
			{children}
		</div>
	)
}
