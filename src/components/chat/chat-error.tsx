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
			className="glass-surface glass-inner-glow animate-liquid-pop rounded-[1.35rem] border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground"
			role="alert"
		>
			<p className="leading-6 text-foreground-subtle">{message}</p>
			{onRetry ? (
				<Button
					variant="secondary"
					size="sm"
					className="glass-refract-control glass-refract-hover mt-3 rounded-full"
					onClick={onRetry}
				>
					<RotateCcw aria-hidden="true" />
					Tentar novamente
				</Button>
			) : null}
		</div>
	)
}
