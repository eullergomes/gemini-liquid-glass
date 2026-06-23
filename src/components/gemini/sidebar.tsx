'use client'

import {
	HelpCircle,
	History,
	MessageSquarePlus,
	Settings,
	Sparkles,
	UserCircle,
	X,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { GeminiMark } from '@/components/gemini/gemini-mark'
import { SidebarItem } from '@/components/gemini/sidebar-item'
import { IconButton } from '@/components/ui/icon-button'

export interface SidebarProps {
	onNewConversation?: () => void
	onOpenChange: (open: boolean) => void
	open: boolean
}

const sidebarItems = [
	{
		description: 'Começar uma conversa limpa',
		icon: MessageSquarePlus,
		id: 'new-chat',
		label: 'Nova conversa',
	},
	{
		description: 'Descobrir assistentes e ideias',
		icon: Sparkles,
		id: 'gems',
		label: 'Explorar Gems',
	},
	{
		description: 'Retomar assuntos recentes',
		icon: History,
		id: 'history',
		label: 'Histórico recente',
	},
	{
		description: 'Preferências da experiência',
		icon: Settings,
		id: 'settings',
		label: 'Configurações',
	},
	{
		description: 'Dicas e suporte',
		icon: HelpCircle,
		id: 'help',
		label: 'Ajuda',
	},
]

const focusableSelector = [
	'button:not([disabled])',
	'[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

interface SidebarBrandProps {
	titleId: string
}

function SidebarBrand({ titleId }: SidebarBrandProps) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<GeminiMark
				size="md"
				aria-label="Gemini"
			/>
			<div className="min-w-0">
				<h2
					id={titleId}
					className="truncate text-base font-semibold text-foreground"
				>
					Menu Gemini
				</h2>
				<p className="truncate text-xs text-muted-foreground">
					Navegue pela experiência
				</p>
			</div>
		</div>
	)
}

interface SidebarNavigationProps {
	onItemClick: (itemId: string) => void
	tabIndex?: number
}

function SidebarNavigation({ onItemClick, tabIndex }: SidebarNavigationProps) {
	return (
		<nav
			aria-label="Menu principal"
			className="flex flex-1 flex-col gap-1"
		>
			{sidebarItems.map((item) => (
				<SidebarItem
					key={item.id}
					description={item.description}
					icon={item.icon}
					label={item.label}
					tabIndex={tabIndex}
					onClick={() => onItemClick(item.id)}
				/>
			))}
		</nav>
	)
}

export function Sidebar({ onNewConversation, onOpenChange, open }: SidebarProps) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
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
			closeButtonRef.current?.focus()
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

	const handleItemClick = (itemId: string) => {
		if (itemId === 'new-chat') {
			onNewConversation?.()
		}

		closeSidebar()
	}

	return (
		<>
			<aside
				data-slot="desktop-rail"
				aria-label="Atalhos do Gemini"
				className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col items-center justify-between border-r border-white/5 bg-background/45 px-3 py-6 backdrop-blur-xl desktop:flex"
			>
				<div className="flex flex-col items-center gap-8">
					<GeminiMark
						size="sm"
						aria-label="Gemini"
					/>
					<IconButton
						aria-label="Nova conversa"
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
						onClick={() => handleItemClick('new-chat')}
					>
						<MessageSquarePlus aria-hidden="true" />
					</IconButton>
				</div>
				<div className="flex flex-col items-center gap-5">
					<IconButton
						aria-label="Configurações"
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
					>
						<Settings aria-hidden="true" />
					</IconButton>
					<IconButton
						aria-label="Perfil"
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
					>
						<UserCircle aria-hidden="true" />
					</IconButton>
				</div>
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
					className={`absolute inset-0 cursor-default bg-black/55 backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
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
					className="glass-elevated glass-inner-glow fixed inset-y-0 flex w-[min(20rem,calc(100vw-2rem))] flex-col rounded-r-3xl border-y-0 border-l-0 p-3 shadow-glass transition-[left] duration-300 ease-out motion-reduce:transition-none"
					style={{
						left: open ? '0' : '-20rem',
						transform: 'none',
						translate: 'none',
					}}
				>
					<div className="flex items-center justify-between gap-3 px-1 pb-5 pt-2">
						<SidebarBrand titleId="gemini-sidebar-title" />
						<IconButton
							ref={closeButtonRef}
							aria-label="Fechar menu"
							variant="ghost"
							size="sm"
							tabIndex={open ? 0 : -1}
							className="text-muted-foreground hover:bg-white/10 hover:text-foreground"
							onClick={closeSidebar}
						>
							<X aria-hidden="true" />
						</IconButton>
					</div>
					<SidebarNavigation
						tabIndex={open ? 0 : -1}
						onItemClick={handleItemClick}
					/>
				</aside>
			</div>
		</>
	)
}
