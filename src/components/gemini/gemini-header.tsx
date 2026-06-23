import { ChevronDown, Menu } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

export interface GeminiHeaderProps {
	isMenuOpen: boolean
	onMenuOpen: () => void
}

export function GeminiHeader({ isMenuOpen, onMenuOpen }: GeminiHeaderProps) {
	return (
		<header
			data-slot="gemini-header"
			className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between px-3"
		>
			<div className="flex min-w-0 items-center gap-2">
				<IconButton
					aria-label="Abrir menu"
					variant="ghost"
					size="md"
					className="desktop:hidden"
					aria-controls="gemini-sidebar"
					aria-expanded={isMenuOpen}
					aria-haspopup="dialog"
					onClick={onMenuOpen}
				>
					<Menu aria-hidden="true" />
				</IconButton>
				<div className="min-w-0">
					<p className="truncate text-xl font-medium leading-6 text-foreground">
						Gemini
					</p>
					<Button
						variant="ghost"
						size="sm"
						className="-ml-2 h-7 rounded-full px-2 text-xs text-muted-foreground hover:bg-surface-raised desktop:ml-0"
					>
						<span>1.5 Flash</span>
						<ChevronDown aria-hidden="true" />
					</Button>
				</div>
			</div>
			<Avatar
				name="Eulle"
				size="md"
				variant="glass"
				aria-label="Perfil do usuário"
			/>
		</header>
	)
}
