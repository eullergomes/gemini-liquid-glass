'use client'

import { ChevronDown, Mic, Plus, SendHorizontal } from 'lucide-react'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { Textarea } from '@/components/ui/textarea'

export interface ChatComposerProps {
	disabled?: boolean
	modelLabel?: string
	onSubmit: (message: string) => void
	placement: 'dock' | 'hero'
}

export function ChatComposer({
	disabled = false,
	modelLabel = 'Flash',
	onSubmit,
	placement,
}: ChatComposerProps) {
	const [message, setMessage] = useState('')
	const canSubmit = message.trim().length > 0 && !disabled
	const isHero = placement === 'hero'

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (!canSubmit) {
			return
		}

		onSubmit(message.trim())
		setMessage('')
	}

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			event.currentTarget.form?.requestSubmit()
		}
	}

	return (
		<div
			data-slot="chat-composer-wrap"
			data-placement={placement}
			className={
				isHero
					? 'pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-3 pt-12 desktop:static desktop:z-auto desktop:w-full desktop:px-0 desktop:pb-0 desktop:pt-0'
					: 'pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/90 to-transparent px-3 pb-3 pt-12 desktop:left-[var(--sidebar-offset)] desktop:px-8 desktop:pb-6'
			}
		>
			<form
				data-slot="chat-composer"
				className="glass-elevated pointer-events-auto mx-auto flex h-[4.75rem] w-full max-w-[21.25rem] items-center gap-2 rounded-[2.375rem] border-white/10 bg-[#202124]/90 px-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-glass-focus desktop:h-18 desktop:max-w-[51.5rem] desktop:px-6"
				onSubmit={handleSubmit}
			>
				<label
					htmlFor="chat-prompt"
					className="sr-only"
				>
					Mensagem para o Gemini
				</label>
				<div className="relative shrink-0">
					<IconButton
						aria-label="Adicionar arquivo"
						variant="ghost"
						size="md"
						className="size-11 text-foreground-subtle hover:bg-white/10 hover:text-foreground [&_svg]:size-6 desktop:size-12 desktop:[&_svg]:size-6"
						disabled={disabled}
					>
						<Plus aria-hidden="true" />
					</IconButton>
				</div>
				<Textarea
					id="chat-prompt"
					variant="default"
					controlSize="sm"
					rows={1}
					placeholder="Peça ao Gemini"
					value={message}
					className="h-12 min-h-0 flex-1 resize-none overflow-hidden border-0 bg-transparent px-1 py-3 text-xl font-medium leading-6 text-foreground shadow-none outline-none ring-0 placeholder:text-foreground-subtle focus:border-0 focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:bg-transparent focus-visible:outline-none desktop:text-lg"
					disabled={disabled}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={handleKeyDown}
				/>
				{isHero ? (
					<button
						type="button"
						className="hidden h-11 shrink-0 items-center gap-2 rounded-full px-3 text-base font-semibold text-foreground-subtle transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring desktop:inline-flex cursor-pointer"
					>
						{modelLabel}
						<ChevronDown
							aria-hidden="true"
							className="size-5"
						/>
					</button>
				) : null}
				<IconButton
					aria-label={canSubmit ? 'Enviar mensagem' : 'Usar voz'}
					variant={canSubmit ? 'primary' : 'ghost'}
					size="md"
					type={canSubmit ? 'submit' : 'button'}
					className={canSubmit ? 'size-11 shadow-glass-soft [&_svg]:size-5 desktop:size-10 desktop:[&_svg]:size-5' : 'size-11 text-foreground-subtle hover:bg-white/10 hover:text-foreground [&_svg]:size-5 desktop:size-10 desktop:[&_svg]:size-5'}
					disabled={disabled}
				>
					{canSubmit ? (
						<SendHorizontal aria-hidden="true" />
					) : (
						<Mic aria-hidden="true" />
					)}
				</IconButton>
			</form>
		</div>
	)
}
