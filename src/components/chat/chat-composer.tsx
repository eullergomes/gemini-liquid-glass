'use client'

import { ImagePlus, Mic, Plus, SendHorizontal } from 'lucide-react'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { Textarea } from '@/components/ui/textarea'

export interface ChatComposerProps {
	disabled?: boolean
	onSubmit: (message: string) => void
}

export function ChatComposer({ disabled = false, onSubmit }: ChatComposerProps) {
	const [message, setMessage] = useState('')
	const canSubmit = message.trim().length > 0 && !disabled

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
			className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pb-3 pt-12 desktop:left-80 desktop:px-8 desktop:pb-6"
		>
			<form
				data-slot="chat-composer"
				className="glass-elevated glass-inner-glow pointer-events-auto mx-auto max-w-4xl rounded-xl p-2 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-glass-focus desktop:max-w-3xl"
				onSubmit={handleSubmit}
			>
				<label
					htmlFor="chat-prompt"
					className="sr-only"
				>
					Mensagem para o Gemini
				</label>
				<Textarea
					id="chat-prompt"
					variant="glass"
					controlSize="sm"
					rows={1}
					placeholder="Pergunte qualquer coisa"
					value={message}
					className="max-h-36 min-h-11 border-transparent bg-surface-raised/70 px-3 py-3 shadow-none transition-colors duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
					disabled={disabled}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<div className="flex items-center justify-between gap-2 px-1 pt-1">
					<div className="flex items-center gap-1">
						<IconButton
							aria-label="Adicionar arquivo"
							variant="ghost"
							size="sm"
							disabled={disabled}
						>
							<Plus aria-hidden="true" />
						</IconButton>
						<IconButton
							aria-label="Adicionar imagem"
							variant="ghost"
							size="sm"
							disabled={disabled}
						>
							<ImagePlus aria-hidden="true" />
						</IconButton>
					</div>
					<div className="flex items-center gap-1">
						<IconButton
							aria-label="Usar voz"
							variant="ghost"
							size="sm"
							disabled={disabled}
						>
							<Mic aria-hidden="true" />
						</IconButton>
						<IconButton
							aria-label="Enviar mensagem"
							variant="primary"
							size="sm"
							type="submit"
							className={canSubmit ? 'shadow-glass-soft' : undefined}
							disabled={!canSubmit}
						>
							<SendHorizontal aria-hidden="true" />
						</IconButton>
					</div>
				</div>
			</form>
		</div>
	)
}
