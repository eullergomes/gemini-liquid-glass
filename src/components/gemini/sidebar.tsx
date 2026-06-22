'use client'

import {
	Compass,
	HelpCircle,
	History,
	Plus,
	Settings,
	Sparkles,
	X,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SidebarItem } from '@/components/gemini/sidebar-item'

export interface SidebarProps {
	onOpenChange: (open: boolean) => void
	open: boolean
}

const sidebarItems = [
	{
		description: 'Começar uma conversa limpa',
		icon: Plus,
		label: 'Nova conversa',
	},
	{
		description: 'Descobrir assistentes e ideias',
		icon: Sparkles,
		label: 'Explorar Gems',
	},
	{
		description: 'Retomar assuntos recentes',
		icon: History,
		label: 'Histórico recente',
	},
	{
		description: 'Preferências da experiência',
		icon: Settings,
		label: 'Configurações',
	},
	{
		description: 'Dicas e suporte',
		icon: HelpCircle,
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

export function Sidebar({ onOpenChange, open }: SidebarProps) {
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
			).filter((element) => element.offsetParent !== null)

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

	return (
		<div
			data-slot="sidebar-root"
			data-open={open ? '' : undefined}
			className={`fixed inset-0 z-40 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
		>
			<button
				type="button"
				aria-label="Fechar menu"
				tabIndex={open ? 0 : -1}
				className={`absolute inset-0 cursor-default bg-foreground/18 backdrop-blur-sm transition-opacity motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
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
				className="glass-elevated glass-inner-glow fixed inset-y-0 flex w-[min(20rem,calc(100vw-2rem))] flex-col rounded-r-xl border-y-0 border-l-0 p-3 shadow-glass transition-[left] duration-300 motion-reduce:transition-none"
				style={{
					left: open ? '0' : '-20rem',
					transform: 'none',
					translate: 'none',
				}}
			>
				<div className="flex items-center justify-between gap-3 px-1 pb-5 pt-2">
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
							<Compass
								aria-hidden="true"
								className="size-5"
							/>
						</span>
						<div className="min-w-0">
							<h2
								id="gemini-sidebar-title"
								className="truncate text-base font-semibold text-foreground"
							>
								Menu Gemini
							</h2>
							<p className="truncate text-xs text-muted-foreground">
								Navegue pela experiência
							</p>
						</div>
					</div>
					<button
						type="button"
						ref={closeButtonRef}
						aria-label="Fechar menu"
						tabIndex={open ? 0 : -1}
						className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
						onClick={closeSidebar}
					>
						<X
							aria-hidden="true"
							className="size-4"
						/>
					</button>
				</div>
				<nav
					aria-label="Menu principal"
					className="flex flex-1 flex-col gap-1"
				>
					{sidebarItems.map((item) => (
						<SidebarItem
							key={item.label}
							description={item.description}
							icon={item.icon}
							label={item.label}
							tabIndex={open ? 0 : -1}
						/>
					))}
				</nav>
				<div className="rounded-lg border border-border bg-surface/70 p-3 text-xs leading-5 text-muted-foreground">
					Respostas mais úteis começam com contexto claro e perguntas específicas.
				</div>
			</aside>
		</div>
	)
}
