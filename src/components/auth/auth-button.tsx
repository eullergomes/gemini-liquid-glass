'use client'

import { LogOut, X } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useId, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

export interface AuthButtonProps {
	className?: string
	placement?: 'header' | 'sidebar'
}

function GoogleGlyph() {
	return (
		<span
			aria-hidden="true"
			className="flex size-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1f1f1f]"
		>
			G
		</span>
	)
}

function getUserInitials(name?: string | null) {
	if (!name) {
		return 'U'
	}

	const [firstName, secondName] = name.trim().split(/\s+/)

	return `${firstName?.[0] ?? ''}${secondName?.[0] ?? ''}`.toUpperCase() || 'U'
}

function LoginModal({
	onClose,
	open,
}: {
	onClose: () => void
	open: boolean
}) {
	const titleId = useId()
	const descriptionId = useId()

	useEffect(() => {
		if (!open) {
			return
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [onClose, open])

	if (!open) {
		return null
	}

	return (
		<div
			data-slot="auth-modal-root"
			className="fixed inset-0 z-50 flex items-center justify-center px-4"
		>
			<button
				type="button"
				aria-label="Fechar login"
				className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				data-slot="auth-modal"
				className="glass-elevated glass-inner-glow relative z-10 w-full max-w-[24rem] rounded-[1.75rem] border-white/12 bg-[#1f1f1f]/92 p-5 text-foreground shadow-[0_28px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl"
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id={titleId}
							className="text-xl font-semibold leading-tight text-white"
						>
							Faça o login na plataforma!
						</h2>
						<p
							id={descriptionId}
							className="mt-2 text-sm leading-6 text-foreground-subtle"
						>
							Conecte-se usando sua conta do Google.
						</p>
					</div>
					<IconButton
						aria-label="Fechar login"
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:bg-white/10 hover:text-white"
						onClick={onClose}
					>
						<X aria-hidden="true" />
					</IconButton>
				</div>
				<Button
					variant="secondary"
					size="lg"
					className="mt-6 h-12 w-full rounded-full border-white/12 bg-white/8 text-base font-semibold text-white hover:bg-white/14"
					onClick={() => {
						void signIn('google')
					}}
				>
					<GoogleGlyph />
					Google
				</Button>
			</div>
		</div>
	)
}

export function AuthButton({
	className,
	placement = 'header',
}: AuthButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data: session, status } = useSession()
	const user = session?.user
	const isSidebar = placement === 'sidebar'

	if (status === 'authenticated' && user) {
		return (
			<div
				data-slot="auth-user"
				className={twMerge(
					'flex min-w-0 items-center gap-3',
					isSidebar ? 'w-full' : '',
					className,
				)}
			>
				<Avatar
					name={user.name ?? user.email ?? 'Usuário'}
					src={user.image ?? undefined}
					size={isSidebar ? 'md' : 'sm'}
					variant="glass"
					aria-label={user.name ?? user.email ?? 'Usuário autenticado'}
				>
					{getUserInitials(user.name)}
				</Avatar>
				{isSidebar ? (
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold text-white">
							{user.name ?? 'Usuário'}
						</p>
						<p className="truncate text-xs font-medium text-muted-foreground">
							{user.email ?? 'Conta Google'}
						</p>
					</div>
				) : null}
				<IconButton
					aria-label="Sair"
					variant="ghost"
					size={isSidebar ? 'lg' : 'sm'}
					className="text-muted-foreground hover:bg-white/10 hover:text-white"
					onClick={() => {
						void signOut()
					}}
				>
					<LogOut aria-hidden="true" />
				</IconButton>
			</div>
		)
	}

	return (
		<>
			<Button
				variant="primary"
				size={isSidebar ? 'md' : 'md'}
				className={twMerge(
					'h-11 rounded-full border-transparent px-5 text-sm font-semibold shadow-none',
					isSidebar ? 'w-full justify-start bg-white/10 text-white hover:bg-white/14' : 'desktop:ml-6 desktop:h-12 desktop:px-6 desktop:text-base',
					className,
				)}
				disabled={status === 'loading'}
				onClick={() => setIsModalOpen(true)}
			>
				Fazer login
			</Button>
			<LoginModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	)
}
