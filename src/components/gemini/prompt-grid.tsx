import { PromptCard } from '@/components/gemini/prompt-card'
import type { ComponentProps } from 'react'

export interface PromptSuggestion {
	description: string
	title: string
	tone: 'blue' | 'violet' | 'cyan' | 'rose'
}

export interface PromptGridProps extends ComponentProps<'div'> {
	suggestions: PromptSuggestion[]
}

export function PromptGrid({ suggestions, ...props }: PromptGridProps) {
	return (
		<div
			data-slot="prompt-grid"
			className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-2"
			{...props}
		>
			{suggestions.map((suggestion) => (
				<PromptCard
					key={suggestion.title}
					title={suggestion.title}
					description={suggestion.description}
					tone={suggestion.tone}
				/>
			))}
		</div>
	)
}
