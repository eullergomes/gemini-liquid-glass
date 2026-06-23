import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export interface GeminiMarkProps extends ComponentProps<'span'> {
	size?: 'sm' | 'md' | 'lg'
}

const markSizes = {
	sm: 'size-6',
	md: 'size-8',
	lg: 'size-11',
}

export function GeminiMark({
	'aria-label': ariaLabel,
	className,
	size = 'md',
	...props
}: GeminiMarkProps) {
	return (
		<span
			data-slot="gemini-mark"
			role={ariaLabel ? 'img' : undefined}
			aria-label={ariaLabel}
			aria-hidden={ariaLabel ? undefined : true}
			className={twMerge('relative inline-flex shrink-0 items-center justify-center', markSizes[size], className)}
			{...props}
		>
			<Image
				src="/assets/images/gemini-liquid-glass-logo.webp"
				alt=""
				aria-hidden="true"
				width={96}
				height={96}
				sizes="44px"
				className="size-full object-contain drop-shadow-[0_0_12px_rgba(64,156,255,0.45)]"
			/>
		</span>
	)
}
