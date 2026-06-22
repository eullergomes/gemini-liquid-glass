import { PromptCard } from '@/components/gemini/prompt-card'
import type { ComponentProps } from 'react'

export interface PromptSuggestion {
	description: string
	title: string
	tone: 'blue' | 'violet' | 'cyan' | 'rose'
}

export interface PromptGridProps extends ComponentProps<'div'> {
	onSuggestionSelect?: (suggestion: PromptSuggestion) => void
	suggestions: PromptSuggestion[]
}

export function PromptGrid({
	onSuggestionSelect,
	suggestions,
	...props
}: PromptGridProps) {
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
					onClick={() => onSuggestionSelect?.(suggestion)}
				/>
			))}
		</div>
	)
}
