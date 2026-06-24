import { streamText } from 'ai'
import { z } from 'zod'
import { auth } from '@/auth'
import {
	CHAT_SYSTEM_PROMPT,
	getGeminiModel,
	hasGoogleGenerativeAiApiKey,
	toModelMessages,
} from '@/lib/ai'
import {
	ensureUserConversation,
	persistConversationTurn,
} from '@/lib/conversations'

export const maxDuration = 30

const chatRequestSchema = z.object({
	conversationId: z.string().min(1).optional(),
	messages: z.array(
		z.object({
			role: z.enum(['user', 'assistant']),
			content: z.string().trim().min(1).max(8000),
		}),
	).min(1).max(40),
})

export async function POST(request: Request): Promise<Response> {
	if (!hasGoogleGenerativeAiApiKey()) {
		return Response.json(
			{
				error: 'A chave GOOGLE_GENERATIVE_AI_API_KEY não está configurada no servidor.',
			},
			{ status: 503 },
		)
	}

	let payload: unknown

	try {
		payload = await request.json()
	} catch {
		return Response.json(
			{ error: 'Não foi possível ler a mensagem enviada.' },
			{ status: 400 },
		)
	}

	const parsedPayload = chatRequestSchema.safeParse(payload)

	if (!parsedPayload.success) {
		return Response.json(
			{ error: 'Envie pelo menos uma mensagem válida para continuar.' },
			{ status: 400 },
		)
	}

	const session = await auth()
	const userId = session?.user?.id
	const lastUserMessage = [...parsedPayload.data.messages].reverse().find((message) => (
		message.role === 'user'
	))
	let persistedConversationId: string | undefined

	if (userId && lastUserMessage) {
		const conversation = await ensureUserConversation({
			conversationId: parsedPayload.data.conversationId,
			titleSource: lastUserMessage.content,
			userId,
		})

		if (!conversation) {
			return Response.json(
				{ error: 'Conversa não encontrada para este usuário.' },
				{ status: 404 },
			)
		}

		persistedConversationId = conversation.id
	}

	try {
		const result = streamText({
			model: getGeminiModel(),
			maxRetries: 0,
			system: CHAT_SYSTEM_PROMPT,
			messages: toModelMessages(parsedPayload.data.messages),
			async onFinish(event) {
				if (!userId || !persistedConversationId || !event.text.trim()) {
					return
				}

				await persistConversationTurn({
					assistantContent: event.text,
					conversationId: persistedConversationId,
					messages: parsedPayload.data.messages,
					userId,
				})
			},
		})

		return result.toTextStreamResponse({
			headers: persistedConversationId
				? { 'x-conversation-id': persistedConversationId }
				: undefined,
		})
	} catch {
		return Response.json(
			{ error: 'Não foi possível iniciar a resposta da IA agora.' },
			{ status: 500 },
		)
	}
}
