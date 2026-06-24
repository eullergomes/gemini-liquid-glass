'use client'

import {
	ChevronDown,
	Clapperboard,
	Image,
	Library,
	MoreVertical,
	PanelLeftClose,
	Paperclip,
	Plus,
	Search,
	Settings,
	X,
} from 'lucide-react'
import { useEffect, useRef, type ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { AuthButton } from '@/components/auth/auth-button'
import { GeminiMark } from '@/components/gemini/gemini-mark'
import { IconButton } from '@/components/ui/icon-button'
import type { ConversationSummary } from '@/types/chat'

export interface SidebarProps {
	activeConversationId?: null | string
	conversations?: ConversationSummary[]
	desktopOpen?: boolean
	isLoadingConversations?: boolean
	onConversationSelect?: (conversationId: string) => void
	onDesktopOpenChange?: (open: boolean) => void
	onNewConversation?: () => void
	onOpenChange: (open: boolean) => void
	open: boolean
}

interface SidebarButtonProps extends ComponentProps<'button'> {
	active?: boolean
	badge?: string
	icon: LucideIcon
	label: string
}

interface SectionTitleProps {
	children: string
	collapsible?: boolean
}

const focusableSelector = [
	'button:not([disabled])',
	'[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

function SidebarButton({
	active = false,
	badge,
	className,
	icon: Icon,
	label,
	...props
}: SidebarButtonProps) {
	return (
		<button
			type="button"
			data-slot="sidebar-button"
			data-active={active ? '' : undefined}
			className={twMerge(
				'sidebar-liquid-button group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				className,
			)}
			{...props}
		>
			<Icon
				aria-hidden="true"
				className="sidebar-liquid-icon size-5 shrink-0"
			/>

			<span className="sidebar-liquid-label">
				{label}
			</span>

			{badge ? (
				<span className="sidebar-liquid-badge">
					{badge}
				</span>
			) : null}
		</button>
	)
}

function SectionTitle({ children, collapsible = false }: SectionTitleProps) {
	return (
		<div className="mt-7 flex h-7 items-center gap-1 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/85">
			<span>{children}</span>

			{collapsible ? (
				<ChevronDown
					aria-hidden="true"
					className="size-4 opacity-70"
				/>
			) : null}
		</div>
	)
}

function RecentItem({
	active = false,
	children,
	onClick,
}: {
	active?: boolean
	children: string
	onClick?: () => void
}) {
	return (
		<button
			type="button"
			data-slot="recent-item"
			data-active={active ? '' : undefined}
			className="sidebar-liquid-button group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			onClick={onClick}
		>
			<span className="sidebar-liquid-label">
				{children}
			</span>

			<MoreVertical
				aria-hidden="true"
				className="sidebar-liquid-icon size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
			/>
		</button>
	)
}

function RecentEmptyState({ isLoading }: { isLoading?: boolean }) {
	return (
		<p className="px-4 py-3 text-sm leading-6 text-muted-foreground">
			{isLoading
				? 'Carregando conversas...'
				: 'Faça login e envie uma mensagem para salvar suas conversas.'}
		</p>
	)
}

function SidebarHeader({
	expanded = true,
	isMobile = false,
	onToggle,
	titleId,
}: {
	expanded?: boolean
	isMobile?: boolean
	onToggle?: () => void
	titleId: string
}) {
	const tooltipLabel = expanded ? 'Fechar barra lateral' : 'Abrir barra lateral'

	return (
		<div
			className={twMerge(
				'sidebar-liquid-layer flex h-16 shrink-0 items-center gap-3',
				expanded ? 'justify-between px-5' : 'justify-center px-3',
			)}
		>
			{expanded ? (
				<div className="flex min-w-0 cursor-pointer items-center gap-3">
					<GeminiMark
						size="sm"
						aria-label="Gemini"
					/>
					<h2
						id={titleId}
						className="truncate text-xl font-semibold text-foreground"
					>
						Gemini
					</h2>
				</div>
			) : (
				<h2
					id={titleId}
					className="sr-only"
				>
					Gemini
				</h2>
			)}
			<div className="group relative">
				<IconButton
					aria-label={tooltipLabel}
					variant="ghost"
					size="lg"
					title={tooltipLabel}
					className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
					onClick={onToggle}
				>
					{isMobile ? (
						<X
							aria-hidden="true"
							color="white"
						/>
					) : (
						<PanelLeftClose
							aria-hidden="true"
							className={expanded ? '' : 'rotate-180'}
						/>
					)}
				</IconButton>
				{isMobile ? null : (
					<span
						role="tooltip"
						className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-background/88 px-4 py-2 text-sm font-medium text-foreground opacity-0 shadow-[0_14px_38px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-opacity duration-150 group-hover:opacity-100"
					>
						{tooltipLabel}
					</span>
				)}
			</div>
		</div>
	)
}

function SidebarContent({
	activeConversationId,
	conversations = [],
	isLoadingConversations = false,
	onConversationSelect,
	onNewConversation,
}: {
	activeConversationId?: null | string
	conversations?: ConversationSummary[]
	isLoadingConversations?: boolean
	onConversationSelect?: (conversationId: string) => void
	onNewConversation?: () => void
}) {
	return (
		<div className="sidebar-liquid-layer flex min-h-0 flex-1 flex-col">
			<div className="shrink-0 space-y-1 px-2 pb-3">
				<SidebarButton
					active
					icon={Paperclip}
					label="Nova conversa"
					onClick={onNewConversation}
				/>

				<SidebarButton
					icon={Search}
					label="Pesquisar conversas"
				/>

				<SidebarButton
					badge="Novo"
					icon={Image}
					label="Imagens"
				/>

				<SidebarButton
					icon={Clapperboard}
					label="Vídeos"
				/>

				<SidebarButton
					icon={Library}
					label="Biblioteca"
				/>
			</div>

			<div className="sidebar-liquid-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-4">
				<SectionTitle collapsible>Notebooks</SectionTitle>

				<SidebarButton
					icon={Plus}
					label="Novo notebook"
					className="mt-1"
				/>

				<SectionTitle collapsible>Recentes</SectionTitle>

				<div className="mt-1 space-y-1">
					{conversations.length > 0 ? (
						conversations.map((conversation) => (
							<RecentItem
								active={conversation.id === activeConversationId}
								key={conversation.id}
								onClick={() => onConversationSelect?.(conversation.id)}
							>
								{conversation.title}
							</RecentItem>
						))
					) : (
						<RecentEmptyState isLoading={isLoadingConversations} />
					)}
				</div>
			</div>
		</div>
	)
}

function SidebarFooter() {
	return (
		<div className="sidebar-liquid-footer flex h-18 shrink-0 items-center gap-3 px-3">
			<AuthButton placement="sidebar" />
		</div>
	)
}

export function Sidebar({
	activeConversationId,
	conversations,
	desktopOpen = true,
	isLoadingConversations,
	onConversationSelect,
	onDesktopOpenChange,
	onNewConversation,
	onOpenChange,
	open,
}: SidebarProps) {
	const panelRef = useRef<HTMLElement>(null)
	const previousFocusRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		if (!open) {
			return
		}

		previousFocusRef.current = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		const focusTimeout = window.setTimeout(() => {
			panelRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()
		}, 0)

		return () => {
			window.clearTimeout(focusTimeout)
			document.body.style.overflow = previousOverflow
			previousFocusRef.current?.focus()
		}
	}, [open])

	useEffect(() => {
		if (!open) {
			return
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault()
				onOpenChange(false)
				return
			}

			if (event.key !== 'Tab') {
				return
			}

			const panel = panelRef.current
			const focusableElements = Array.from(
				panel?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
			).filter((element) => element.getClientRects().length > 0)

			if (focusableElements.length === 0) {
				event.preventDefault()
				return
			}

			const firstElement = focusableElements[0]
			const lastElement = focusableElements[focusableElements.length - 1]

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault()
				lastElement.focus()
			}

			if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault()
				firstElement.focus()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [onOpenChange, open])

	const closeSidebar = () => {
		onOpenChange(false)
	}

	const toggleDesktopSidebar = () => {
		onDesktopOpenChange?.(!desktopOpen)
	}

	const startNewConversation = () => {
		onNewConversation?.()
		closeSidebar()
	}

	return (
		<>
			<aside
				data-slot="desktop-sidebar"
				data-state={desktopOpen ? 'open' : 'closed'}
				aria-labelledby="gemini-desktop-sidebar-title"
				className={twMerge(
					'sidebar-liquid-shell fixed inset-y-0 left-0 z-20 hidden flex-col rounded-r-[1.75rem] border-r transition-[width] duration-300 ease-out motion-reduce:transition-none desktop:flex',
					desktopOpen ? 'w-[22.5rem]' : 'w-16',
				)}
			>
				<SidebarHeader
					expanded={desktopOpen}
					titleId="gemini-desktop-sidebar-title"
					onToggle={toggleDesktopSidebar}
				/>
				{desktopOpen ? (
					<>
						<SidebarContent
							activeConversationId={activeConversationId}
							conversations={conversations}
							isLoadingConversations={isLoadingConversations}
							onConversationSelect={onConversationSelect}
							onNewConversation={startNewConversation}
						/>
						<SidebarFooter />
					</>
				) : (
					<div className="flex flex-1 flex-col items-center justify-between px-2 pb-5 pt-2">
						<div className="flex flex-col items-center gap-5">
							<GeminiMark
								size="sm"
								aria-label="Gemini"
							/>
							<IconButton
								aria-label="Nova conversa"
								variant="ghost"
								size="md"
								className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
								onClick={onNewConversation}
							>
								<Paperclip aria-hidden="true" />
							</IconButton>
						</div>
						<IconButton
							aria-label="Configurações"
							variant="ghost"
							size="lg"
							className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
						>
							<Settings aria-hidden="true" />
						</IconButton>
					</div>
				)}
			</aside>
			<div
				data-slot="sidebar-root"
				data-open={open ? '' : undefined}
				className={`fixed inset-0 z-40 desktop:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
			>
				<button
					type="button"
					aria-label="Fechar menu"
					tabIndex={open ? 0 : -1}
					className={`sidebar-liquid-overlay absolute inset-0 cursor-default transition-opacity duration-300 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
					data-open={open ? '' : undefined}
					onClick={closeSidebar}
				/>
				<aside
					id="gemini-sidebar"
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-hidden={!open}
					aria-labelledby="gemini-sidebar-title"
					data-slot="sidebar"
					data-open={open ? '' : undefined}
					className="sidebar-liquid-shell fixed inset-y-0 flex w-[min(25rem,calc(90vw-2rem))] flex-col rounded-r-[1.75rem] border-r transition-[left] duration-300 ease-out motion-reduce:transition-none"
					style={{
						left: open ? '0' : '-25rem',
						transform: 'none',
						translate: 'none',
					}}
				>
					<SidebarHeader
						isMobile
						titleId="gemini-sidebar-title"
						onToggle={closeSidebar}
					/>
					<SidebarContent
						activeConversationId={activeConversationId}
						conversations={conversations}
						isLoadingConversations={isLoadingConversations}
						onConversationSelect={onConversationSelect}
						onNewConversation={startNewConversation}
					/>
					<SidebarFooter />
				</aside>
			</div>
		</>
	)
}
