'use client'

import { useEffect, useRef } from 'react'
import { ChatError } from '@/components/chat/chat-error'
import { ChatLoading } from '@/components/chat/chat-loading'
import { ChatMessage } from '@/components/chat/chat-message'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

export interface ChatThreadProps {
	error?: string | null
	isLoading: boolean
	messages: ChatMessageType[]
	onRetry?: () => void
}

export function ChatThread({
	error,
	isLoading,
	messages,
	onRetry,
}: ChatThreadProps) {
	const endRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		endRef.current?.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'end',
		})
	}, [isLoading, messages])

	return (
		<section
			data-slot="chat-thread"
			aria-label="Conversa"
			aria-live="polite"
			className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 pb-4"
		>
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					message={message}
				/>
			))}
			{isLoading ? <ChatLoading /> : null}
			{error ? (
				<ChatError
					message={error}
					onRetry={onRetry}
				/>
			) : null}
			<div
				ref={endRef}
				data-slot="chat-thread-end"
			/>
		</section>
	)
}
