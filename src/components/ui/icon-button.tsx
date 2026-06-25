import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const iconButtonVariants = tv({
	base: [
		'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200',
		'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	variants: {
		variant: {
			primary: 'glass-button-primary glass-refract-control glass-refract-hover border-primary text-primary-foreground',
			secondary: 'glass-icon-button border-border text-foreground',
			ghost: 'glass-icon-button border-transparent bg-transparent text-muted-foreground shadow-none hover:text-foreground',
			glass: 'glass-icon-button glass-refract-control glass-refract-hover glass-inner-glow border-border text-foreground',
		},
		size: {
			sm: 'size-8 [&_svg]:size-3.5',
			md: 'size-10 [&_svg]:size-4',
			lg: 'size-12 [&_svg]:size-5',
		},
	},
	defaultVariants: {
		variant: 'ghost',
		size: 'md',
	},
})

export interface IconButtonProps
	extends Omit<ComponentProps<'button'>, 'aria-label'>,
		VariantProps<typeof iconButtonVariants> {
	'aria-label': string
}

export function IconButton({
	className,
	variant,
	size,
	disabled,
	children,
	'aria-label': ariaLabel,
	...props
}: IconButtonProps) {
	return (
		<button
			type="button"
			data-slot="icon-button"
			data-disabled={disabled ? '' : undefined}
			aria-label={ariaLabel}
			className={twMerge(iconButtonVariants({ variant, size }), className)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
