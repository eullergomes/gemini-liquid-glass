'use client'

import { useCallback, useState } from 'react'
import { ChatComposer } from '@/components/chat/chat-composer'
import { ChatThread } from '@/components/chat/chat-thread'
import { GeminiHeader } from '@/components/gemini/gemini-header'
import { PromptGrid, type PromptSuggestion } from '@/components/gemini/prompt-grid'
import { Sidebar } from '@/components/gemini/sidebar'
import type { ChatApiMessage, ChatMessage } from '@/types/chat'

const promptSuggestions: PromptSuggestion[] = [
	{
		title: 'Planejar uma rotina de estudos',
		description: 'Organize foco, pausas e revisões para a semana.',
		tone: 'blue',
	},
	{
		title: 'Resumir um conceito técnico',
		description: 'Transforme uma ideia complexa em explicação clara.',
		tone: 'violet',
	},
	{
		title: 'Gerar ideias para um projeto',
		description: 'Explore caminhos criativos para uma entrega web.',
		tone: 'cyan',
	},
	{
		title: 'Revisar um texto em português',
		description: 'Ajuste clareza, tom e estrutura sem perder sua voz.',
		tone: 'rose',
	},
]

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
	const [isLoading, setIsLoading] = useState(false)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const hasMessages = messages.length > 0

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

	const handleSuggestionSelect = useCallback((suggestion: PromptSuggestion) => {
		submitMessage(suggestion.title)
	}, [submitMessage])

	return (
		<div
			data-slot="app-shell"
			className="liquid-background relative min-h-dvh overflow-x-hidden text-foreground"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/45 to-transparent dark:from-white/5"
			/>
			<Sidebar
				onNewConversation={clearConversation}
				open={isSidebarOpen}
				onOpenChange={setIsSidebarOpen}
			/>
			<GeminiHeader
				isMenuOpen={isSidebarOpen}
				onMenuOpen={openSidebar}
			/>
			<main
				data-slot="app-main"
				className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 pb-40 pt-24 desktop:mx-0 desktop:ml-80 desktop:w-[calc(100%_-_20rem)] desktop:max-w-5xl desktop:px-8 desktop:pt-28"
			>
				{hasMessages ? (
					<div className="animate-liquid-enter flex flex-1 flex-col">
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
						className="animate-liquid-enter flex flex-1 flex-col justify-center gap-8"
					>
						<div className="space-y-3">
							<p className="text-sm font-medium text-muted-foreground">
								Assistente Gemini
							</p>
							<h1
								id="empty-state-title"
								className="text-balance text-5xl font-semibold leading-[1.05] tracking-normal text-foreground"
							>
								<span className="block bg-gradient-to-r from-gemini-blue via-gemini-violet to-gemini-rose bg-clip-text text-transparent">
									Olá, eulle
								</span>
								<span className="block text-foreground-subtle">
									Como posso ajudar hoje?
								</span>
							</h1>
							<p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground">
								Converse, explore ideias e organize respostas em uma experiência leve e fluida.
							</p>
						</div>
						<PromptGrid
							suggestions={promptSuggestions}
							onSuggestionSelect={handleSuggestionSelect}
						/>
					</section>
				)}
			</main>
			<ChatComposer
				disabled={isLoading}
				onSubmit={submitMessage}
			/>
		</div>
	)
}
