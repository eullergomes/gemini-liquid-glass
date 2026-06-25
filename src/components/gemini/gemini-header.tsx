import { ChevronDown, Menu } from 'lucide-react'
import { AuthButton } from '@/components/auth/auth-button'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

export interface GeminiHeaderProps {
	isMenuOpen: boolean
	modelLabel?: string
	onMenuOpen: () => void
}

const desktopNavItems = [
	'Sobre o Gemini',
	'Baixar o app do Gemini',
	'Assinaturas',
	'Para empresas',
]

export function GeminiHeader({
	isMenuOpen,
	modelLabel = 'Gemini 2.5 Flash',
	onMenuOpen,
}: GeminiHeaderProps) {
	return (
		<header
			data-slot="gemini-header"
			className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-4 text-foreground desktop:hidden"
		>
			<div className="flex min-w-0 items-center gap-3 desktop:hidden">
				<IconButton
					aria-label="Abrir menu"
					variant="glass"
					size="lg"
					className="border-transparent text-foreground shadow-none hover:text-foreground"
					aria-controls="gemini-sidebar"
					aria-expanded={isMenuOpen}
					aria-haspopup="dialog"
					onClick={onMenuOpen}
				>
					<Menu aria-hidden="true" />
				</IconButton>
				<Button
					variant="ghost"
					size="sm"
					className="h-9 rounded-full border-transparent bg-transparent px-2 text-base font-semibold text-foreground shadow-none hover:text-foreground"
				>
					<span className="truncate">{modelLabel}</span>
					<ChevronDown aria-hidden="true" />
				</Button>
			</div>
			<nav
				aria-label="Links do Gemini"
				className="ml-auto hidden items-center gap-5 text-sm font-medium text-foreground-subtle desktop:flex"
			>
				{desktopNavItems.map((item) => (
					<span
						key={item}
						className="whitespace-nowrap"
					>
						{item}
					</span>
				))}
			</nav>
			<AuthButton />
		</header>
	)
}
