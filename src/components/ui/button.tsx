import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const buttonVariants = tv({
	base: [
		'inline-flex cursor-pointer items-center justify-center rounded-lg border font-medium transition-all duration-200',
		'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	variants: {
		variant: {
			primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
			secondary: 'border-border bg-secondary text-foreground hover:bg-muted',
			ghost: 'border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
			destructive: 'border-destructive bg-destructive text-primary-foreground hover:bg-destructive/90',
		},
		size: {
			sm: 'h-8 gap-1.5 px-2 text-xs [&_svg]:size-3',
			md: 'h-10 gap-2 px-3 text-sm [&_svg]:size-4',
			lg: 'h-12 gap-2.5 px-4 text-base [&_svg]:size-5',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md',
	},
})

export interface ButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {}

export function Button({
	className,
	variant,
	size,
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			data-slot="button"
			data-disabled={disabled ? '' : undefined}
			className={twMerge(buttonVariants({ variant, size }), className)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
