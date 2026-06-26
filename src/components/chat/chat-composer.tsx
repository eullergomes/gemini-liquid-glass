'use client'

import { ChevronDown, Mic, Plus, SendHorizontal } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconButton } from '@/components/ui/icon-button'
import { Textarea } from '@/components/ui/textarea'

const maxVisibleTextareaLines = 7

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
	const [isTextareaScrollable, setIsTextareaScrollable] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const canSubmit = message.trim().length > 0 && !disabled
	const isHero = placement === 'hero'
	const hasMessage = message.length > 0
	const textareaStyle = {
		fontSize: 'clamp(1rem, 1rem + 0.45vw, 1.1rem)',
		...(hasMessage ? { flex: '0 0 100%', order: 1, width: '100%' } : {}),
	} satisfies CSSProperties

	useLayoutEffect(() => {
		const textarea = textareaRef.current

		if (!textarea) {
			return
		}

		const styles = window.getComputedStyle(textarea)
		const lineHeight = Number.parseFloat(styles.lineHeight) || 24
		const paddingTop = Number.parseFloat(styles.paddingTop) || 0
		const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0
		const maxHeight = (lineHeight * maxVisibleTextareaLines) + paddingTop + paddingBottom

		textarea.style.height = 'auto'

		const shouldScroll = textarea.scrollHeight > maxHeight + 1
		const nextHeight = Math.min(textarea.scrollHeight, maxHeight)

		textarea.style.height = `${nextHeight}px`
		textarea.style.overflowY = shouldScroll ? 'auto' : 'hidden'
		setIsTextareaScrollable(shouldScroll)
	}, [message])

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
					? 'pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-12 desktop:static desktop:z-auto desktop:w-full desktop:px-0 desktop:pb-0 desktop:pt-0'
					: 'pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/90 to-transparent px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-12 desktop:left-[var(--sidebar-offset)] desktop:px-8 desktop:pb-6'
			}
		>
			<form
				data-slot="chat-composer"
				data-filled={hasMessage ? '' : undefined}
				data-scrollable={isTextareaScrollable ? '' : undefined}
				className={twMerge(
					'glass-elevated glass-refract-soft glass-inner-glow pointer-events-auto mx-auto flex min-h-[4.75rem] w-full max-w-[21.25rem] border-white/10 bg-[#202124]/90 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-300 desktop:min-h-[4.5rem] desktop:max-w-[51.5rem]',
					hasMessage
						? 'flex-wrap content-start items-end gap-x-2 gap-y-2 rounded-[1.875rem] px-4 py-4 desktop:px-5 desktop:py-4'
						: 'items-center gap-2 rounded-[2.375rem] px-5 py-0 desktop:px-6 desktop:py-3',
				)}
				onSubmit={handleSubmit}
			>
				<label
					htmlFor="chat-prompt"
					className="sr-only"
				>
					Mensagem para o Gemini
				</label>
				<div
					className={twMerge('relative shrink-0', hasMessage ? 'order-2' : '')}
					style={hasMessage ? { order: 2 } : undefined}
				>
					<IconButton
						aria-label="Adicionar arquivo"
						variant="glass"
						size="md"
						className="size-11 border-transparent text-foreground-subtle shadow-none hover:text-foreground [&_svg]:size-6 desktop:size-12 desktop:[&_svg]:size-6"
						disabled={disabled}
					>
						<Plus aria-hidden="true" />
					</IconButton>
				</div>
				<Textarea
					ref={textareaRef}
					id="chat-prompt"
					variant="default"
					controlSize="sm"
					rows={1}
					placeholder="Peça ao Gemini"
					value={message}
					data-scrollable={isTextareaScrollable ? '' : undefined}
					className={twMerge(
						'max-h-[12rem] min-h-12 min-w-0 flex-1 resize-none overflow-y-hidden border-0 bg-transparent font-medium text-foreground shadow-none outline-none ring-0 placeholder:text-foreground-subtle focus:border-0 focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:bg-transparent focus-visible:outline-none data-[scrollable]:overflow-y-auto desktop:max-h-[11.25rem]',
						hasMessage ? 'order-1 w-full flex-none basis-full px-2 py-1' : 'px-1 py-3',
					)}
					style={textareaStyle}
					disabled={disabled}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={handleKeyDown}
				/>
				{isHero ? (
					<button
						type="button"
						style={hasMessage ? { order: 2 } : undefined}
						className={twMerge(
							'glass-button hidden h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border-transparent bg-transparent px-3 text-base font-semibold text-foreground-subtle shadow-none transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring desktop:inline-flex',
							hasMessage ? 'order-2 ml-auto mr-10' : '',
						)}
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
					variant={canSubmit ? 'primary' : 'glass'}
					size="md"
					type={canSubmit ? 'submit' : 'button'}
					style={hasMessage ? { order: 3 } : undefined}
					className={twMerge(
						canSubmit ? 'absolute right-3 size-11 shadow-glass-soft [&_svg]:size-5 desktop:size-10 desktop:[&_svg]:size-5' : 'size-11 border-transparent text-foreground-subtle shadow-none hover:text-foreground [&_svg]:size-5 desktop:size-12 desktop:[&_svg]:size-5',
						hasMessage ? 'order-3' : '',
						hasMessage && !isHero ? 'ml-auto' : '',
					)}
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
