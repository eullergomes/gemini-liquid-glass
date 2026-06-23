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
			className="animate-liquid-pop rounded-[1.35rem] border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground"
			role="alert"
		>
			<p className="leading-6 text-foreground-subtle">{message}</p>
			{onRetry ? (
				<Button
					variant="secondary"
					size="sm"
					className="mt-3 rounded-full"
					onClick={onRetry}
				>
					<RotateCcw aria-hidden="true" />
					Tentar novamente
				</Button>
			) : null}
		</div>
	)
}
