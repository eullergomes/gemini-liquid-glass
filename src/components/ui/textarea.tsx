import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const textareaVariants = tv({
	base: [
		'min-h-24 w-full resize-none rounded-lg px-3 py-2 text-sm text-foreground transition-colors',
		'placeholder:text-muted-foreground',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:cursor-not-allowed disabled:opacity-50',
	],
	variants: {
		variant: {
			default: 'glass-input',
			glass: 'glass-input glass-refract-soft',
		},
		controlSize: {
			sm: 'min-h-20 text-xs',
			md: 'min-h-24 text-sm',
			lg: 'min-h-32 text-base',
		},
	},
	defaultVariants: {
		variant: 'default',
		controlSize: 'md',
	},
})

export interface TextareaProps
	extends Omit<ComponentProps<'textarea'>, 'size'>,
		VariantProps<typeof textareaVariants> {}

export function Textarea({
	className,
	variant,
	controlSize,
	...props
}: TextareaProps) {
	return (
		<textarea
			data-slot="textarea"
			className={twMerge(textareaVariants({ variant, controlSize }), className)}
			{...props}
		/>
	)
}
