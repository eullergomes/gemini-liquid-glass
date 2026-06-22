'use client'

import { ImagePlus, Mic, Plus, SendHorizontal } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { Textarea } from '@/components/ui/textarea'

export function ChatComposer() {
	return (
		<div
			data-slot="chat-composer-wrap"
			className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pb-3 pt-12"
		>
			<form
				data-slot="chat-composer"
				className="glass-elevated glass-inner-glow pointer-events-auto mx-auto max-w-4xl rounded-xl p-2"
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
					className="max-h-36 min-h-11 border-transparent bg-surface-raised/70 px-3 py-3 shadow-none"
				/>
				<div className="flex items-center justify-between gap-2 px-1 pt-1">
					<div className="flex items-center gap-1">
						<IconButton
							aria-label="Adicionar arquivo"
							variant="ghost"
							size="sm"
						>
							<Plus aria-hidden="true" />
						</IconButton>
						<IconButton
							aria-label="Adicionar imagem"
							variant="ghost"
							size="sm"
						>
							<ImagePlus aria-hidden="true" />
						</IconButton>
					</div>
					<div className="flex items-center gap-1">
						<IconButton
							aria-label="Usar voz"
							variant="ghost"
							size="sm"
						>
							<Mic aria-hidden="true" />
						</IconButton>
						<IconButton
							aria-label="Enviar mensagem"
							variant="primary"
							size="sm"
						>
							<SendHorizontal aria-hidden="true" />
						</IconButton>
					</div>
				</div>
			</form>
		</div>
	)
}
