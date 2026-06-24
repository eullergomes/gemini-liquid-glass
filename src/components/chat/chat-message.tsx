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
			className={`animate-liquid-enter flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
		>
			{/* {isUser ? null : (
				<span
					data-slot="assistant-avatar"
					className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/6 text-white shadow-glass-soft"
				>
					<Sparkles
						aria-hidden="true"
						className="size-4"
					/>
				</span>
			)} */}
			<div
				data-slot="message-bubble"
				className={`max-w-[86%] whitespace-pre-wrap rounded-[1.35rem] px-4 py-3 text-sm leading-6 transition-shadow duration-300 desktop:max-w-[90%] ${
					isUser
						? 'bg-[#2b2b2b] text-white shadow-glass-soft'
						: 'bg-transparent text-white'
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
