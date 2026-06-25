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
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { AuthButton } from '@/components/auth/auth-button'
import { GeminiMark } from '@/components/gemini/gemini-mark'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import type { ConversationSummary } from '@/types/chat'

interface MenuPosition {
	left: number
	top: number
}

export interface SidebarProps {
	activeConversationId?: null | string
	conversations?: ConversationSummary[]
	desktopOpen?: boolean
	isLoadingConversations?: boolean
	onConversationDelete?: (conversationId: string) => Promise<void>
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
				'sidebar-liquid-button glass-list-item group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
	conversationId,
	onDelete,
	onClick,
}: {
	active?: boolean
	children: string
	conversationId: string
	onDelete?: (conversationId: string) => Promise<void>
	onClick?: () => void
}) {
	const [isDeleting, setIsDeleting] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
	const menuButtonRef = useRef<HTMLButtonElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const dialogTitleId = `delete-conversation-title-${conversationId}`
	const dialogDescriptionId = `delete-conversation-description-${conversationId}`

	useEffect(() => {
		if (!isMenuOpen) {
			return
		}

		function updateMenuPosition() {
			const rect = menuButtonRef.current?.getBoundingClientRect()

			if (!rect) {
				return
			}

			const menuWidth = 112
			const viewportPadding = 8
			const isDesktopViewport = window.matchMedia('(min-width: 60rem)').matches
			const sidebarRect = menuButtonRef.current
				?.closest<HTMLElement>('[data-slot="sidebar"], [data-slot="desktop-sidebar"]')
				?.getBoundingClientRect()
			const mobileAnchorRight = sidebarRect?.right ?? rect.right
			const preferredLeft = isDesktopViewport
				? rect.right + 8
				: mobileAnchorRight + 8
			const nextLeft = preferredLeft + menuWidth + viewportPadding <= window.innerWidth
				? preferredLeft
				: Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding)

			setMenuPosition({
				left: nextLeft,
				top: rect.bottom + 6,
			})
		}

		updateMenuPosition()

		function handlePointerDown(event: PointerEvent) {
			if (
				event.target instanceof Node
				&& !menuRef.current?.contains(event.target)
			) {
				setIsMenuOpen(false)
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsMenuOpen(false)
			}
		}

		window.addEventListener('pointerdown', handlePointerDown)
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('resize', updateMenuPosition)
		window.addEventListener('scroll', updateMenuPosition, true)

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown)
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('resize', updateMenuPosition)
			window.removeEventListener('scroll', updateMenuPosition, true)
		}
	}, [isMenuOpen])

	async function confirmDelete() {
		if (!onDelete || isDeleting) {
			return
		}

		setIsDeleting(true)

		try {
			await onDelete(conversationId)
			setIsModalOpen(false)
		} finally {
			setIsDeleting(false)
		}
	}

	const dropdown = isMenuOpen && menuPosition
		? createPortal(
			<div
				ref={menuRef}
				role="menu"
				className="glass-elevated glass-inner-glow fixed z-[120] min-w-28 rounded-2xl border-white/10 bg-[#202124]/88 p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
				style={{
					left: menuPosition.left,
					top: menuPosition.top,
				}}
			>
				<button
					type="button"
					role="menuitem"
					className="glass-button-destructive glass-refract-control glass-refract-hover glass-inner-glow flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-right text-sm font-semibold text-destructive shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(0,0,0,0.22)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={() => {
						setIsMenuOpen(false)
						setIsModalOpen(true)
					}}
				>
					Excluir
				</button>
			</div>,
			document.body,
		)
		: null

	const deleteModal = isModalOpen
		? createPortal(
			<div
				data-slot="delete-conversation-modal"
				className="fixed inset-0 z-[130] flex items-center justify-center px-4"
			>
				<button
					type="button"
					aria-label="Cancelar exclusão"
					className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
					onClick={() => setIsModalOpen(false)}
				/>
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby={dialogTitleId}
					aria-describedby={dialogDescriptionId}
					className="glass-elevated glass-inner-glow relative z-10 w-full max-w-[24rem] rounded-[1.5rem] border-white/12 bg-[#1f1f1f]/95 p-5 text-foreground shadow-[0_28px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl"
				>
					<h2
						id={dialogTitleId}
						className="text-lg font-semibold text-white"
					>
						Excluir conversa?
					</h2>
					<p
						id={dialogDescriptionId}
						className="mt-2 text-sm leading-6 text-foreground-subtle"
					>
						Essa ação não pode ser desfeita. A conversa{' '}
						<strong className="font-semibold text-white">
							“{children}”
						</strong>{' '}
						será removida do seu histórico.
					</p>
					<div className="mt-5 flex justify-end gap-2">
						<Button
							variant="ghost"
							size="md"
							className="rounded-full"
							disabled={isDeleting}
							onClick={() => setIsModalOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							size="md"
							className="rounded-full"
							disabled={isDeleting}
							onClick={() => {
								void confirmDelete()
							}}
						>
							{isDeleting ? 'Excluindo...' : 'Excluir'}
						</Button>
					</div>
				</div>
			</div>,
			document.body,
		)
		: null

	return (
		<div
			data-slot="recent-item"
			data-active={active ? '' : undefined}
			className="sidebar-liquid-button glass-list-item group relative focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
		>
			<button
				type="button"
				className="sidebar-liquid-label text-left focus-visible:outline-none"
				onClick={onClick}
			>
				{children}
			</button>

			<div
				className="relative z-10 shrink-0"
			>
				<IconButton
					ref={menuButtonRef}
					aria-label={`Abrir opções de ${children}`}
					aria-expanded={isMenuOpen}
					aria-haspopup="menu"
					variant="glass"
					size="sm"
					className="size-8 border-transparent text-muted-foreground opacity-100 shadow-none hover:text-foreground desktop:opacity-0 desktop:group-hover:opacity-100 desktop:group-focus-within:opacity-100 data-[open]:opacity-100"
					data-open={isMenuOpen ? '' : undefined}
					onClick={(event) => {
						event.stopPropagation()
						setIsMenuOpen((current) => !current)
					}}
				>
					<MoreVertical aria-hidden="true" />
				</IconButton>

				{dropdown}
			</div>

			{deleteModal}
		</div>
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
	const [isTooltipOpen, setIsTooltipOpen] = useState(false)
	const [tooltipPosition, setTooltipPosition] = useState<MenuPosition | null>(null)
	const tooltipButtonRef = useRef<HTMLButtonElement>(null)

	function updateTooltipPosition() {
		const rect = tooltipButtonRef.current?.getBoundingClientRect()

		if (!rect) {
			return
		}

		setTooltipPosition({
			left: rect.right + 8,
			top: rect.top + (rect.height / 2),
		})
	}

	const tooltip = !isMobile && isTooltipOpen && tooltipPosition
		? createPortal(
			<span
				role="tooltip"
				className="pointer-events-none fixed z-[140] -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-background/92 px-4 py-2 text-sm font-medium text-foreground opacity-100 shadow-[0_14px_38px_rgba(0,0,0,0.42)] backdrop-blur-xl"
				style={{
					left: tooltipPosition.left,
					top: tooltipPosition.top,
				}}
			>
				{tooltipLabel}
			</span>,
			document.body,
		)
		: null

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
					ref={tooltipButtonRef}
					aria-label={tooltipLabel}
					variant="glass"
					size="lg"
					className="border-transparent text-muted-foreground shadow-none hover:text-foreground"
					onBlur={() => setIsTooltipOpen(false)}
					onClick={onToggle}
					onFocus={() => {
						updateTooltipPosition()
						setIsTooltipOpen(true)
					}}
					onMouseEnter={() => {
						updateTooltipPosition()
						setIsTooltipOpen(true)
					}}
					onMouseLeave={() => setIsTooltipOpen(false)}
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
				{tooltip}
			</div>
		</div>
	)
}

function SidebarContent({
	activeConversationId,
	conversations = [],
	isLoadingConversations = false,
	onConversationDelete,
	onConversationSelect,
	onNewConversation,
}: {
	activeConversationId?: null | string
	conversations?: ConversationSummary[]
	isLoadingConversations?: boolean
	onConversationDelete?: (conversationId: string) => Promise<void>
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
								conversationId={conversation.id}
								key={conversation.id}
								onDelete={onConversationDelete}
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
	onConversationDelete,
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
							onConversationDelete={onConversationDelete}
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
								variant="glass"
								size="md"
								className="border-transparent text-muted-foreground shadow-none hover:text-foreground"
								onClick={onNewConversation}
							>
								<Paperclip aria-hidden="true" />
							</IconButton>
						</div>
						<IconButton
							aria-label="Configurações"
							variant="glass"
							size="lg"
							className="border-transparent text-muted-foreground shadow-none hover:text-foreground"
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
					className={`sidebar-liquid-shell fixed inset-y-0 left-0 flex w-[min(25rem,calc(90vw-2rem))] transform-gpu flex-col rounded-r-[1.75rem] border-r transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none ${open ? 'translate-x-0' : '-translate-x-full'}`}
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
						onConversationDelete={onConversationDelete}
						onConversationSelect={onConversationSelect}
						onNewConversation={startNewConversation}
					/>
					<SidebarFooter />
				</aside>
			</div>
		</>
	)
}
