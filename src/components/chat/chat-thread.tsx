'use client'

import { useEffect, useRef } from 'react'
import { ChatLoading } from '@/components/chat/chat-loading'
import { ChatMessage } from '@/components/chat/chat-message'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

export interface ChatThreadProps {
	isLoading: boolean
	messages: ChatMessageType[]
}

export function ChatThread({ isLoading, messages }: ChatThreadProps) {
	const endRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		endRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		})
	}, [isLoading, messages])

	return (
		<section
			data-slot="chat-thread"
			aria-label="Conversa"
			aria-live="polite"
			className="flex flex-1 flex-col gap-4 pb-4"
		>
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					message={message}
				/>
			))}
			{isLoading ? <ChatLoading /> : null}
			<div
				ref={endRef}
				data-slot="chat-thread-end"
			/>
		</section>
	)
}
