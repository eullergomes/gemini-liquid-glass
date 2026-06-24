'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ChatComposer } from '@/components/chat/chat-composer'
import { ChatThread } from '@/components/chat/chat-thread'
import { ChatThreadSkeleton } from '@/components/chat/chat-thread-skeleton'
import { GeminiHeader } from '@/components/gemini/gemini-header'
import { GeminiMark } from '@/components/gemini/gemini-mark'
import { Sidebar } from '@/components/gemini/sidebar'
import type {
	ChatApiMessage,
	ChatMessage,
	ConversationSummary,
} from '@/types/chat'

const modelLabel = 'Gemini 2.5 Flash'
const heroTitle = 'Conheça o Gemini, seu assistente pessoal de IA com um visual Liquid Glass'
const genericErrorMessage = 'Não consegui responder agora. Confira a configuração da API e tente novamente.'
const friendlyErrorPrefixes = [
	'A chave',
	'A resposta',
	'Envie',
	'Não foi',
	'Conversa',
]

interface ConversationListResponse {
	conversations?: ConversationSummary[]
}

interface StoredConversationResponse {
	id: string
	messages: Array<{
		content: string
		createdAt: string
		id: string
		role: ChatMessage['role']
	}>
	title: string
}

interface ToastState {
	message: string
	type: 'error' | 'success'
}

export interface AppShellProps {
	initialConversationId?: string
}

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

function getConversationPath(conversationId: string) {
	return `/${encodeURIComponent(conversationId)}`
}

export function AppShell({ initialConversationId }: AppShellProps) {
	const router = useRouter()
	const { data: session, status } = useSession()
	const userId = session?.user?.id ?? null
	const loadingConversationRef = useRef<null | string>(null)
	const loadedConversationRef = useRef<null | string>(null)
	const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationId ?? null)
	const [conversations, setConversations] = useState<ConversationSummary[]>([])
	const [error, setError] = useState<string | null>(null)
	const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isOpeningConversation, setIsOpeningConversation] = useState(Boolean(initialConversationId))
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [toast, setToast] = useState<ToastState | null>(null)
	const hasMessages = messages.length > 0
	const hasConversationView = hasMessages || Boolean(activeConversationId) || isOpeningConversation
	const canUseSavedConversations = status === 'authenticated'
	const shellStyle = {
		'--sidebar-offset': isDesktopSidebarOpen ? '22.5rem' : '4rem',
	} as CSSProperties

	const refreshConversations = useCallback(async () => {
		if (!canUseSavedConversations) {
			setConversations([])
			return
		}

		try {
			const response = await fetch('/api/conversations', {
				cache: 'no-store',
			})

			if (!response.ok) {
				return
			}

			const payload = await response.json() as ConversationListResponse
			setConversations(Array.isArray(payload.conversations) ? payload.conversations : [])
		} catch {
			setConversations([])
		}
	}, [canUseSavedConversations])

	const loadConversation = useCallback(async (conversationId: string) => {
		if (loadingConversationRef.current === conversationId) {
			return
		}

		loadingConversationRef.current = conversationId
		setActiveConversationId(conversationId)
		setMessages([])
		setError(null)
		setIsOpeningConversation(true)

		try {
			const response = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}`, {
				cache: 'no-store',
			})

			if (!response.ok) {
				throw new Error(await readErrorMessage(response))
			}

			const payload = await response.json() as StoredConversationResponse

			loadedConversationRef.current = payload.id
			setActiveConversationId(payload.id)
			setMessages(payload.messages.map((message) => ({
				...message,
				createdAt: new Date(message.createdAt),
			})))
			setIsSidebarOpen(false)
		} catch (caughtError) {
			loadedConversationRef.current = null
			setMessages([])
			setError(getFriendlyErrorMessage(caughtError))
		} finally {
			loadingConversationRef.current = null
			setIsOpeningConversation(false)
		}
	}, [])

	useEffect(() => {
		if (status === 'loading') {
			return
		}

		if (status !== 'authenticated') {
			const resetSessionState = window.setTimeout(() => {
				setConversations([])
				setIsOpeningConversation(false)
				loadedConversationRef.current = null

				if (initialConversationId) {
					setActiveConversationId(initialConversationId)
					setMessages([])
					setError('Faça login para abrir conversas salvas.')
				} else {
					setActiveConversationId(null)
				}
			}, 0)

			return () => window.clearTimeout(resetSessionState)
		}

		const refreshSessionState = window.setTimeout(() => {
			void refreshConversations()

			if (
				initialConversationId
				&& loadedConversationRef.current !== initialConversationId
				&& loadingConversationRef.current !== initialConversationId
			) {
				void loadConversation(initialConversationId)
			}
		}, 0)

		return () => window.clearTimeout(refreshSessionState)
	}, [initialConversationId, loadConversation, refreshConversations, status, userId])

	useEffect(() => {
		if (!toast) {
			return
		}

		const toastTimeout = window.setTimeout(() => {
			setToast(null)
		}, 4200)

		return () => window.clearTimeout(toastTimeout)
	}, [toast])

	const openSidebar = useCallback(() => {
		setIsSidebarOpen(true)
	}, [])

	const requestAssistantResponse = useCallback(async (conversationMessages: ChatMessage[]) => {
		setError(null)
		setIsLoading(true)

		let assistantMessageId: string | null = null
		let nextConversationId = activeConversationId

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					conversationId: canUseSavedConversations
						? activeConversationId ?? undefined
						: undefined,
					messages: toApiMessages(conversationMessages),
				}),
			})

			if (!response.ok) {
				throw new Error(await readErrorMessage(response))
			}

			const responseConversationId = response.headers.get('x-conversation-id')

			if (responseConversationId) {
				nextConversationId = responseConversationId
				setActiveConversationId(responseConversationId)

				if (canUseSavedConversations && responseConversationId !== activeConversationId) {
					router.replace(getConversationPath(responseConversationId), { scroll: false })
				}
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

			if (nextConversationId) {
				void refreshConversations()
			}
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
	}, [activeConversationId, canUseSavedConversations, refreshConversations, router])

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
		setActiveConversationId(null)
		loadedConversationRef.current = null
		setError(null)
		setMessages([])
		setIsLoading(false)
		setIsSidebarOpen(false)
		router.push('/', { scroll: false })
	}, [router])

	const openConversation = useCallback(async (conversationId: string) => {
		if (isLoading || isOpeningConversation) {
			return
		}

		router.push(getConversationPath(conversationId), { scroll: false })
		void loadConversation(conversationId)
	}, [isLoading, isOpeningConversation, loadConversation, router])

	const deleteConversation = useCallback(async (conversationId: string) => {
		try {
			const response = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error(await readErrorMessage(response))
			}

			setConversations((currentConversations) => currentConversations.filter((conversation) => (
				conversation.id !== conversationId
			)))

			if (conversationId === activeConversationId) {
				setActiveConversationId(null)
				loadedConversationRef.current = null
				setError(null)
				setMessages([])
				setIsLoading(false)
				setIsOpeningConversation(false)
				router.push('/', { scroll: false })
			}

			setToast({
				message: 'Conversa excluída com sucesso.',
				type: 'success',
			})
		} catch (caughtError) {
			setToast({
				message: getFriendlyErrorMessage(caughtError),
				type: 'error',
			})
		}
	}, [activeConversationId, router])

	return (
		<div
			data-slot="app-shell"
			data-state={hasConversationView ? 'chat' : 'empty'}
			className="liquid-background relative min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-300"
			style={shellStyle}
		>
			<Sidebar
				activeConversationId={activeConversationId}
				conversations={canUseSavedConversations ? conversations : []}
				desktopOpen={isDesktopSidebarOpen}
				isLoadingConversations={status === 'loading' || isOpeningConversation}
				onConversationDelete={deleteConversation}
				onConversationSelect={openConversation}
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
					hasConversationView
						? 'relative z-10 flex min-h-dvh w-full flex-col px-4 pb-36 pt-20 transition-[padding] duration-300 ease-out desktop:pl-[calc(var(--sidebar-offset)_+_3rem)] desktop:pr-12 desktop:pt-20 motion-reduce:transition-none'
						: 'relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 pb-36 pt-20 transition-[padding] duration-300 ease-out desktop:pl-[calc(var(--sidebar-offset)_+_3rem)] desktop:pr-12 desktop:pb-14 desktop:pt-20 motion-reduce:transition-none'
				}
			>
				{hasConversationView ? (
					<div className="animate-liquid-enter mx-auto flex w-full max-w-4xl flex-1 flex-col">
						{isOpeningConversation ? (
							<ChatThreadSkeleton />
						) : (
							<ChatThread
								error={error}
								isLoading={isLoading}
								messages={messages}
								onRetry={retryLastMessage}
							/>
						)}
					</div>
				) : (
					<section
						aria-labelledby="empty-state-title"
						className="mx-auto flex w-full max-w-[53rem] flex-1 flex-col items-center justify-center gap-8 text-center desktop:gap-14"
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
			{hasConversationView ? (
				<ChatComposer
					disabled={isLoading || isOpeningConversation}
					modelLabel="Flash"
					placement="dock"
					onSubmit={submitMessage}
				/>
			) : null}
			{toast ? (
				<div
					role="status"
					aria-live="polite"
					data-slot="app-toast"
					data-type={toast.type}
					className="glass-elevated fixed bottom-24 left-4 right-4 z-[80] mx-auto max-w-sm rounded-2xl border-white/12 bg-[#202124]/95 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_55px_rgba(0,0,0,0.4)] backdrop-blur-2xl desktop:bottom-8 desktop:left-auto desktop:right-8 desktop:mx-0"
				>
					{toast.message}
				</div>
			) : null}
		</div>
	)
}
