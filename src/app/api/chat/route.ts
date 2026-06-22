import { streamText } from 'ai'
import { z } from 'zod'
import {
	CHAT_SYSTEM_PROMPT,
	getGeminiModel,
	hasGoogleGenerativeAiApiKey,
	toModelMessages,
} from '@/lib/ai'

export const maxDuration = 30

const chatRequestSchema = z.object({
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

	try {
		const result = streamText({
			model: getGeminiModel(),
			system: CHAT_SYSTEM_PROMPT,
			messages: toModelMessages(parsedPayload.data.messages),
		})

		return result.toTextStreamResponse()
	} catch {
		return Response.json(
			{ error: 'Não foi possível iniciar a resposta da IA agora.' },
			{ status: 500 },
		)
	}
}
