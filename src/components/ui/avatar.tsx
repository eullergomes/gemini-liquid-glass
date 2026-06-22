import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import type { ComponentProps } from 'react'

export const avatarVariants = tv({
	base: [
		'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-foreground shadow-glass-soft',
		'[&_[data-slot=avatar-image]]:size-full [&_[data-slot=avatar-image]]:object-cover',
	],
	variants: {
		size: {
			sm: 'size-8 text-xs',
			md: 'size-10 text-sm',
			lg: 'size-12 text-base',
		},
		variant: {
			default: 'bg-secondary',
			glass: 'glass-panel glass-inner-glow',
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'default',
	},
})

export interface AvatarProps
	extends ComponentProps<'div'>,
		VariantProps<typeof avatarVariants> {
	alt?: string
	name?: string
	src?: string
}

function getInitials(name?: string) {
	if (!name) {
		return 'U'
	}

	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('')
}

export function Avatar({
	alt,
	children,
	className,
	name,
	role,
	size,
	src,
	variant,
	...props
}: AvatarProps) {
	const fallback = children ?? getInitials(name)
	const ariaLabel = props['aria-label'] ?? alt ?? name

	return (
		<div
			data-slot="avatar"
			role={role ?? (ariaLabel ? 'img' : undefined)}
			aria-label={ariaLabel}
			className={twMerge(avatarVariants({ size, variant }), className)}
			{...props}
		>
			{src ? (
				<Image
					data-slot="avatar-image"
					src={src}
					alt={alt ?? name ?? ''}
					width={48}
					height={48}
					unoptimized
				/>
			) : (
				<span
					data-slot="avatar-fallback"
					aria-hidden="true"
				>
					{fallback}
				</span>
			)}
		</div>
	)
}
