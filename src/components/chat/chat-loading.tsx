export function ChatLoading() {
	return (
		<div
			data-slot="chat-loading"
			className="animate-liquid-pop glass-panel glass-inner-glow flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground"
			aria-label="Gemini está digitando"
		>
			<span
				aria-hidden="true"
				className="typing-dot size-2 rounded-full bg-gemini-blue"
			/>
			<span
				aria-hidden="true"
				className="typing-dot size-2 rounded-full bg-gemini-violet [--dot-delay:120ms]"
			/>
			<span
				aria-hidden="true"
				className="typing-dot size-2 rounded-full bg-gemini-rose [--dot-delay:240ms]"
			/>
			<span className="ml-1">Gemini está pensando</span>
		</div>
	)
}
