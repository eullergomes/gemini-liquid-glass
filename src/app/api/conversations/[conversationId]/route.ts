import { z } from 'zod'
import { auth } from '@/auth'
import { listConversationMessages } from '@/lib/conversations'

const routeContextSchema = z.object({
	params: z.union([
		z.promise(
			z.object({
				conversationId: z.string().min(1),
			}),
		),
		z.object({
			conversationId: z.string().min(1),
		}),
	]),
})

export async function GET(
	_request: Request,
	context: unknown,
): Promise<Response> {
	const parsedContext = routeContextSchema.safeParse(context)

	if (!parsedContext.success) {
		return Response.json({ error: 'Conversa inválida.' }, { status: 400 })
	}

	const session = await auth()
	const userId = session?.user?.id

	if (!userId) {
		return Response.json({ error: 'Faça login para abrir conversas salvas.' }, { status: 401 })
	}

	const { conversationId } = await parsedContext.data.params
	const conversation = await listConversationMessages(conversationId, userId)

	if (!conversation) {
		return Response.json({ error: 'Conversa não encontrada.' }, { status: 404 })
	}

	return Response.json(conversation)
}
