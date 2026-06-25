import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

export interface ChatMessageProps {
	message: ChatMessageType
}

const markdownComponents: Components = {
	a({ children, href, title }) {
		return (
			<a
				href={href}
				rel="noreferrer"
				target="_blank"
				title={title}
			>
				{children}
			</a>
		)
	},
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
				className={`max-w-full rounded-[1.35rem] px-4 py-3 text-sm leading-6 transition-shadow duration-300 desktop:max-w-[90%] ${
					isUser
						? 'glass-surface glass-inner-glow whitespace-pre-wrap border-white/8 text-white'
						: 'bg-transparent text-white'
				}`}
			>
				{isUser ? (
					message.content
				) : (
					<div data-slot="assistant-markdown">
						<ReactMarkdown
							components={markdownComponents}
							rehypePlugins={[rehypeSanitize]}
							remarkPlugins={[remarkGfm]}
						>
							{message.content}
						</ReactMarkdown>
					</div>
				)}
			</div>
			{/* {isUser ? (
				<Avatar
					name="Eulle"
					size="sm"
					variant="glass"
					aria-label="Você"
					className="mt-1"
				/>
			) : null} */}
		</article>
	)
}
