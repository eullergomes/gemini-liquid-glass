import { PromptCard } from '@/components/gemini/prompt-card'
import type { ComponentProps, CSSProperties } from 'react'

export interface PromptSuggestion {
	description: string
	title: string
	tone: 'blue' | 'violet' | 'cyan' | 'rose'
}

export interface PromptGridProps extends ComponentProps<'div'> {
	onSuggestionSelect?: (suggestion: PromptSuggestion) => void
	suggestions: PromptSuggestion[]
}

type PromptCardStyle = CSSProperties & {
	'--enter-delay': string
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
			{suggestions.map((suggestion, index) => (
				<PromptCard
					key={suggestion.title}
					title={suggestion.title}
					description={suggestion.description}
					tone={suggestion.tone}
					style={{ '--enter-delay': `${index * 55}ms` } as PromptCardStyle}
					onClick={() => onSuggestionSelect?.(suggestion)}
				/>
			))}
		</div>
	)
}
