'use client'

import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import { useState, type ComponentProps } from 'react'

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
	const [hasImageError, setHasImageError] = useState(false)
	const fallback = children ?? getInitials(name)
	const ariaLabel = props['aria-label'] ?? alt ?? name
	const shouldShowImage = Boolean(src && !hasImageError)

	return (
		<div
			data-slot="avatar"
			role={role ?? (ariaLabel ? 'img' : undefined)}
			aria-label={ariaLabel}
			className={twMerge(avatarVariants({ size, variant }), className)}
			{...props}
		>
			{shouldShowImage ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					data-slot="avatar-image"
					src={src ?? ''}
					alt=""
					aria-hidden="true"
					referrerPolicy="no-referrer"
					onError={() => setHasImageError(true)}
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
