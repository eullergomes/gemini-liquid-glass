'use client'

import { useCallback, useState } from 'react'
import type { CSSProperties } from 'react'
import { ChatComposer } from '@/components/chat/chat-composer'
import { ChatThread } from '@/components/chat/chat-thread'
import { GeminiHeader } from '@/components/gemini/gemini-header'
import { GeminiMark } from '@/components/gemini/gemini-mark'
import { Sidebar } from '@/components/gemini/sidebar'
import type { ChatApiMessage, ChatMessage } from '@/types/chat'

const modelLabel = 'Gemini 2.5 Flash'
const heroTitle = 'Conheça o Gemini, seu assistente pessoal de IA'
const genericErrorMessage = 'Não consegui responder agora. Confira a configuração da API e tente novamente.'
const friendlyErrorPrefixes = [
	'A chave',
	'A resposta',
	'Envie',
	'Não foi',
]

function createMessageId(prefix: string) {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return `${prefix}-${crypto.randomUUID()}`
	}

	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function toApiMessages(messages: ChatMessage[]): ChatApiMessage[] {
	return messages.map((message) => ({
		content: message.content,
		role: message.role,
	}))
}

function getFriendlyErrorMessage(error: unknown) {
	if (!(error instanceof Error)) {
		return genericErrorMessage
	}

	return friendlyErrorPrefixes.some((prefix) => error.message.startsWith(prefix))
		? error.message
		: genericErrorMessage
}

async function readErrorMessage(response: Response) {
	try {
		const payload = await response.json() as { error?: unknown }

		if (typeof payload.error === 'string' && payload.error.trim()) {
			return payload.error
		}
	} catch {
		return genericErrorMessage
	}

	return genericErrorMessage
}

export function AppShell() {
	const [error, setError] = useState<string | null>(null)
	const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const hasMessages = messages.length > 0
	const shellStyle = {
		'--sidebar-offset': isDesktopSidebarOpen ? '22.5rem' : '4rem',
	} as CSSProperties

	const openSidebar = useCallback(() => {
		setIsSidebarOpen(true)
	}, [])

	const requestAssistantResponse = useCallback(async (conversationMessages: ChatMessage[]) => {
		setError(null)
		setIsLoading(true)

		let assistantMessageId: string | null = null

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages: toApiMessages(conversationMessages),
				}),
			})

			if (!response.ok) {
				throw new Error(await readErrorMessage(response))
			}

			if (!response.body) {
				throw new Error('A resposta da IA veio vazia.')
			}

			assistantMessageId = createMessageId('assistant')

			const assistantMessage: ChatMessage = {
				content: '',
				createdAt: new Date(),
				id: assistantMessageId,
				role: 'assistant',
			}

			setMessages([...conversationMessages, assistantMessage])

			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let assistantContent = ''

			while (true) {
				const { done, value } = await reader.read()

				if (done) {
					break
				}

				assistantContent += decoder.decode(value, { stream: true })

				setMessages((currentMessages) => currentMessages.map((message) => (
					message.id === assistantMessageId
						? { ...message, content: assistantContent }
						: message
				)))
			}

			assistantContent += decoder.decode()

			setMessages((currentMessages) => currentMessages.map((message) => (
				message.id === assistantMessageId
					? { ...message, content: assistantContent.trim() || 'Não recebi conteúdo da IA.' }
					: message
			)))
		} catch (caughtError) {
			if (assistantMessageId) {
				setMessages((currentMessages) => currentMessages.filter((message) => (
					message.id !== assistantMessageId
				)))
			}

			setError(getFriendlyErrorMessage(caughtError))
		} finally {
			setIsLoading(false)
		}
	}, [])

	const submitMessage = useCallback((content: string) => {
		const trimmedContent = content.trim()

		if (!trimmedContent || isLoading) {
			return
		}

		const userMessage: ChatMessage = {
			content: trimmedContent,
			createdAt: new Date(),
			id: createMessageId('user'),
			role: 'user',
		}

		const nextMessages = [...messages, userMessage]

		setMessages(nextMessages)
		void requestAssistantResponse(nextMessages)
	}, [isLoading, messages, requestAssistantResponse])

	const retryLastMessage = useCallback(() => {
		if (isLoading) {
			return
		}

		const lastUserMessageIndex = messages.findLastIndex((message) => message.role === 'user')

		if (lastUserMessageIndex === -1) {
			return
		}

		const retryMessages = messages.slice(0, lastUserMessageIndex + 1)
		setMessages(retryMessages)
		void requestAssistantResponse(retryMessages)
	}, [isLoading, messages, requestAssistantResponse])

	const clearConversation = useCallback(() => {
		setError(null)
		setMessages([])
		setIsLoading(false)
		setIsSidebarOpen(false)
	}, [])

	return (
		<div
			data-slot="app-shell"
			data-state={hasMessages ? 'chat' : 'empty'}
			className="liquid-background relative min-h-dvh overflow-x-hidden bg-background text-foreground"
			style={shellStyle}
		>
			<Sidebar
				desktopOpen={isDesktopSidebarOpen}
				onDesktopOpenChange={setIsDesktopSidebarOpen}
				onNewConversation={clearConversation}
				open={isSidebarOpen}
				onOpenChange={setIsSidebarOpen}
			/>
			<GeminiHeader
				isMenuOpen={isSidebarOpen}
				modelLabel={modelLabel}
				onMenuOpen={openSidebar}
			/>
			<main
				data-slot="app-main"
				className={
					hasMessages
						? 'relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 pb-36 pt-20 desktop:ml-[var(--sidebar-offset)] desktop:w-[calc(100%_-_var(--sidebar-offset))] desktop:max-w-none desktop:px-12 desktop:pt-20'
						: 'relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 pb-36 pt-20 desktop:ml-[var(--sidebar-offset)] desktop:w-[calc(100%_-_var(--sidebar-offset))] desktop:pb-14 desktop:pt-20'
				}
			>
				{hasMessages ? (
					<div className="animate-liquid-enter flex w-full flex-1 flex-col">
						<ChatThread
							error={error}
							isLoading={isLoading}
							messages={messages}
							onRetry={retryLastMessage}
						/>
					</div>
				) : (
					<section
						aria-labelledby="empty-state-title"
						className="flex w-full max-w-[53rem] flex-1 flex-col items-center justify-center gap-8 text-center desktop:gap-14"
					>
						<GeminiMark
							size="lg"
							className="desktop:hidden"
							aria-label="Gemini"
						/>
						<h1
							id="empty-state-title"
							className="max-w-[22rem] text-balance text-[1.85rem] font-normal leading-[1.2] tracking-normal text-foreground desktop:max-w-[56rem] desktop:text-[3rem] desktop:leading-[1.15]"
						>
							{heroTitle}
						</h1>
						<ChatComposer
							disabled={isLoading}
							modelLabel="Flash"
							placement="hero"
							onSubmit={submitMessage}
						/>
					</section>
				)}
			</main>
			{hasMessages ? (
				<ChatComposer
					disabled={isLoading}
					modelLabel="Flash"
					placement="dock"
					onSubmit={submitMessage}
				/>
			) : null}
			{/* <p className="fixed bottom-3 left-[var(--sidebar-offset)] right-0 z-10 hidden text-center text-xs font-medium text-muted-foreground desktop:block">
				Sujeito aos Termos do Google e à Política de Privacidade do Google. O Gemini é uma IA e pode cometer erros.
			</p> */}
		</div>
	)
}
