import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ChatErrorProps {
	message: string
	onRetry?: () => void
}

export function ChatError({ message, onRetry }: ChatErrorProps) {
	return (
		<div
			data-slot="chat-error"
			className="animate-liquid-pop glass-panel glass-inner-glow rounded-xl border-destructive/30 p-4 text-sm text-foreground"
			role="alert"
		>
			<p className="leading-6 text-foreground-subtle">{message}</p>
			{onRetry ? (
				<Button
					variant="secondary"
					size="sm"
					className="mt-3"
					onClick={onRetry}
				>
					<RotateCcw aria-hidden="true" />
					Tentar novamente
				</Button>
			) : null}
		</div>
	)
}
