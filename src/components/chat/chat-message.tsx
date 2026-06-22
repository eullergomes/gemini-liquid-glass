import { Sparkles } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

export interface ChatMessageProps {
	message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === 'user'

	return (
		<article
			data-slot="chat-message"
			data-role={message.role}
			className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
		>
			{isUser ? null : (
				<span
					data-slot="assistant-avatar"
					className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glass-soft"
				>
					<Sparkles
						aria-hidden="true"
						className="size-4"
					/>
				</span>
			)}
			<div
				data-slot="message-bubble"
				className={`max-w-[82%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6 shadow-glass-soft ${
					isUser
						? 'bg-primary text-primary-foreground'
						: 'glass-panel glass-inner-glow text-foreground'
				}`}
			>
				{message.content}
			</div>
			{isUser ? (
				<Avatar
					name="Eulle"
					size="sm"
					variant="glass"
					aria-label="Você"
					className="mt-1"
				/>
			) : null}
		</article>
	)
}
