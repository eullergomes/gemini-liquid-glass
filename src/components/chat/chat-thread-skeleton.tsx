const skeletonRows = [
	{ align: 'end', width: 'w-[58%]' },
	{ align: 'start', width: 'w-[82%]' },
	{ align: 'start', width: 'w-[68%]' },
	{ align: 'end', width: 'w-[46%]' },
	{ align: 'start', width: 'w-[76%]' },
] as const

export function ChatThreadSkeleton() {
	return (
		<section
			data-slot="chat-thread-skeleton"
			aria-busy="true"
			aria-label="Carregando conversa"
			className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 pb-4"
		>
			{skeletonRows.map((row, index) => (
				<div
					key={`${row.align}-${row.width}-${index}`}
					className={`flex ${row.align === 'end' ? 'justify-end' : 'justify-start'}`}
				>
					<div
						className={`glass-surface h-14 animate-pulse rounded-[1.35rem] border-white/8 ${row.width}`}
					/>
				</div>
			))}
			<span className="sr-only">Carregando histórico da conversa...</span>
		</section>
	)
}
