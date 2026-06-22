export function ChatLoading() {
	return (
		<div
			data-slot="chat-loading"
			className="flex items-center gap-2 px-1 py-3 text-sm text-muted-foreground"
			aria-label="Gemini está digitando"
		>
			<span
				aria-hidden="true"
				className="size-2 animate-pulse rounded-full bg-gemini-blue"
			/>
			<span
				aria-hidden="true"
				className="size-2 animate-pulse rounded-full bg-gemini-violet [animation-delay:120ms]"
			/>
			<span
				aria-hidden="true"
				className="size-2 animate-pulse rounded-full bg-gemini-rose [animation-delay:240ms]"
			/>
			<span className="ml-1">Gemini está pensando</span>
		</div>
	)
}
