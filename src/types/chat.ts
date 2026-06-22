export type ChatMessageRole = 'user' | 'assistant'

export interface ChatMessage {
	content: string
	createdAt: Date
	id: string
	role: ChatMessageRole
}
