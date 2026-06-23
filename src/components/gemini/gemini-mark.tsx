import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export interface GeminiMarkProps extends ComponentProps<'span'> {
	size?: 'sm' | 'md' | 'lg'
}

const markSizes = {
	sm: 'size-5',
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
			<span className="absolute inset-[18%] rotate-45 rounded-[35%_65%_35%_65%] bg-gradient-to-br from-gemini-blue via-gemini-cyan to-gemini-violet blur-[0.5px]" />
			<span className="absolute inset-x-[12%] inset-y-[42%] rounded-full bg-gradient-to-r from-transparent via-gemini-rose to-transparent" />
			<span className="absolute inset-y-[12%] inset-x-[42%] rounded-full bg-gradient-to-b from-transparent via-gemini-cyan to-transparent" />
			<span className="absolute inset-[28%] rounded-full bg-white/80 blur-[2px]" />
		</span>
	)
}
