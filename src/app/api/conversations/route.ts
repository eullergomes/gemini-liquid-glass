import { auth } from '@/auth'
import { listUserConversations } from '@/lib/conversations'

export async function GET(): Promise<Response> {
	const session = await auth()
	const userId = session?.user?.id

	if (!userId) {
		return Response.json({ conversations: [] }, { status: 200 })
	}

	const conversations = await listUserConversations(userId)

	return Response.json({
		conversations: conversations.map((conversation) => ({
			...conversation,
			updatedAt: conversation.updatedAt.toISOString(),
		})),
	})
}
