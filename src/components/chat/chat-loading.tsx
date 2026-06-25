export function ChatLoading() {
	return (
		<div
			data-slot="chat-loading"
			className="glass-surface glass-inner-glow animate-liquid-pop flex w-fit items-center gap-2 rounded-full border-white/8 px-3 py-2 text-sm text-muted-foreground"
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
