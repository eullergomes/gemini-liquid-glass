import { ArrowUpRight, Lightbulb, MessageSquareText, PenLine, Sparkles } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const promptCardVariants = tv({
	base: [
		'glass-panel glass-inner-glow group flex min-h-36 cursor-pointer flex-col justify-between rounded-xl p-4 text-left transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'hover:bg-surface-raised',
	],
	variants: {
		tone: {
			blue: '[--prompt-accent:var(--gemini-blue)]',
			violet: '[--prompt-accent:var(--gemini-violet)]',
			cyan: '[--prompt-accent:var(--gemini-cyan)]',
			rose: '[--prompt-accent:var(--gemini-rose)]',
		},
	},
	defaultVariants: {
		tone: 'blue',
	},
})

export interface PromptCardProps
	extends ComponentProps<'button'>,
		VariantProps<typeof promptCardVariants> {
	description: string
	title: string
}

const toneIcons = {
	blue: Lightbulb,
	violet: Sparkles,
	cyan: MessageSquareText,
	rose: PenLine,
}

export function PromptCard({
	className,
	description,
	title,
	tone = 'blue',
	...props
}: PromptCardProps) {
	const Icon = toneIcons[tone]

	return (
		<button
			type="button"
			data-slot="prompt-card"
			className={twMerge(promptCardVariants({ tone }), className)}
			{...props}
		>
			<span
				data-slot="prompt-card-icon"
				className="flex size-9 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--prompt-accent)_22%,transparent)] text-[var(--prompt-accent)]"
			>
				<Icon
					aria-hidden="true"
					className="size-4"
				/>
			</span>
			<span className="space-y-2">
				<span className="block text-sm font-medium leading-5 text-foreground">
					{title}
				</span>
				<span className="block text-sm leading-5 text-muted-foreground">
					{description}
				</span>
			</span>
			<ArrowUpRight
				aria-hidden="true"
				className="absolute right-4 top-4 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
			/>
		</button>
	)
}
