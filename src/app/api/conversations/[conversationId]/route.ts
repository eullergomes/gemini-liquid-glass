import { z } from 'zod'
import { auth } from '@/auth'
import {
	deleteUserConversation,
	listConversationMessages,
} from '@/lib/conversations'

const conversationIdSchema = z.string().min(1)

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ conversationId: string }> },
): Promise<Response> {
	const { conversationId: rawConversationId } = await params
	const parsedConversationId = conversationIdSchema.safeParse(rawConversationId)

	if (!parsedConversationId.success) {
		return Response.json({ error: 'Conversa inválida.' }, { status: 400 })
	}

	const session = await auth()
	const userId = session?.user?.id

	if (!userId) {
		return Response.json({ error: 'Faça login para abrir conversas salvas.' }, { status: 401 })
	}

	const conversation = await listConversationMessages(parsedConversationId.data, userId)

	if (!conversation) {
		return Response.json({ error: 'Conversa não encontrada.' }, { status: 404 })
	}

	return Response.json(conversation)
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ conversationId: string }> },
): Promise<Response> {
	const { conversationId: rawConversationId } = await params
	const parsedConversationId = conversationIdSchema.safeParse(rawConversationId)

	if (!parsedConversationId.success) {
		return Response.json({ error: 'Conversa inválida.' }, { status: 400 })
	}

	const session = await auth()
	const userId = session?.user?.id

	if (!userId) {
		return Response.json({ error: 'Faça login para excluir conversas salvas.' }, { status: 401 })
	}

	const wasDeleted = await deleteUserConversation(parsedConversationId.data, userId)

	if (!wasDeleted) {
		return Response.json({ error: 'Conversa não encontrada.' }, { status: 404 })
	}

	return Response.json({ ok: true })
}
