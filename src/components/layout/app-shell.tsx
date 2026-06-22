import { ChatComposer } from '@/components/chat/chat-composer'
import { GeminiHeader } from '@/components/gemini/gemini-header'
import { PromptGrid, type PromptSuggestion } from '@/components/gemini/prompt-grid'

const promptSuggestions: PromptSuggestion[] = [
	{
		title: 'Planejar uma rotina de estudos',
		description: 'Organize foco, pausas e revisões para a semana.',
		tone: 'blue',
	},
	{
		title: 'Resumir um conceito técnico',
		description: 'Transforme uma ideia complexa em explicação clara.',
		tone: 'violet',
	},
	{
		title: 'Gerar ideias para um projeto',
		description: 'Explore caminhos criativos para uma entrega web.',
		tone: 'cyan',
	},
	{
		title: 'Revisar um texto em português',
		description: 'Ajuste clareza, tom e estrutura sem perder sua voz.',
		tone: 'rose',
	},
]

export function AppShell() {
	return (
		<div
			data-slot="app-shell"
			className="liquid-background relative min-h-dvh overflow-hidden text-foreground"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/45 to-transparent dark:from-white/5"
			/>
			<GeminiHeader />
			<main
				data-slot="app-main"
				className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 pb-40 pt-24"
			>
				<section
					aria-labelledby="empty-state-title"
					className="flex flex-1 flex-col justify-center gap-8"
				>
					<div className="space-y-3">
						<p className="text-sm font-medium text-muted-foreground">
							Assistente Gemini
						</p>
						<h1
							id="empty-state-title"
							className="text-balance text-5xl font-semibold leading-[1.05] tracking-normal text-foreground"
						>
							<span className="block bg-gradient-to-r from-gemini-blue via-gemini-violet to-gemini-rose bg-clip-text text-transparent">
								Olá, eulle
							</span>
							<span className="block text-foreground-subtle">
								Como posso ajudar hoje?
							</span>
						</h1>
						<p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground">
							Converse, explore ideias e organize respostas em uma experiência leve e fluida.
						</p>
					</div>
					<PromptGrid suggestions={promptSuggestions} />
				</section>
			</main>
			<ChatComposer />
		</div>
	)
}
