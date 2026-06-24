import { prisma } from '@/lib/prisma'
import type { ChatApiMessage, ChatMessageRole } from '@/types/chat'

const conversationTitleMaxLength = 56

interface PersistedConversationSummary {
	id: string
	title: string
	updatedAt: Date
}

interface PersistedConversationMessage {
	content: string
	createdAt: Date
	id: string
	role: string
}

interface PersistedConversationWithMessages {
	id: string
	messages: PersistedConversationMessage[]
	title: string
}

interface SerializedConversationMessage {
	content: string
	createdAt: string
	id: string
	role: ChatMessageRole
}

interface SerializedConversationWithMessages {
	id: string
	messages: SerializedConversationMessage[]
	title: string
}

function createConversationTitle(content: string) {
	const normalizedContent = content.replace(/\s+/g, ' ').trim()

	if (!normalizedContent) {
		return 'Nova conversa'
	}

	return normalizedContent.length > conversationTitleMaxLength
		? `${normalizedContent.slice(0, conversationTitleMaxLength - 1)}...`
		: normalizedContent
}

function isPersistableRole(role: string): role is ChatMessageRole {
	return role === 'user' || role === 'assistant'
}

export async function getUserConversation(
	conversationId: string,
	userId: string,
) {
	return prisma.conversation.findFirst({
		where: {
			id: conversationId,
			userId,
		},
	})
}

export async function ensureUserConversation({
	conversationId,
	titleSource,
	userId,
}: {
	conversationId?: string
	titleSource: string
	userId: string
}) {
	if (conversationId) {
		return getUserConversation(conversationId, userId)
	}

	return prisma.conversation.create({
		data: {
			title: createConversationTitle(titleSource),
			userId,
		},
	})
}

export async function listUserConversations(
	userId: string,
): Promise<PersistedConversationSummary[]> {
	return prisma.conversation.findMany({
		where: {
			userId,
		},
		orderBy: {
			updatedAt: 'desc',
		},
		select: {
			id: true,
			title: true,
			updatedAt: true,
		},
		take: 20,
	})
}

export async function listConversationMessages(
	conversationId: string,
	userId: string,
): Promise<SerializedConversationWithMessages | null> {
	const conversation = await prisma.conversation.findFirst({
		where: {
			id: conversationId,
			userId,
		},
		include: {
			messages: {
				orderBy: {
					createdAt: 'asc',
				},
				select: {
					id: true,
					role: true,
					content: true,
					createdAt: true,
				},
			},
		},
	}) as PersistedConversationWithMessages | null

	if (!conversation) {
		return null
	}

	return {
		id: conversation.id,
		title: conversation.title,
		messages: conversation.messages
			.filter((message) => isPersistableRole(message.role))
			.map((message) => ({
				content: message.content,
				createdAt: message.createdAt.toISOString(),
				id: message.id,
				role: message.role as ChatMessageRole,
			})),
	}
}

export async function deleteUserConversation(
	conversationId: string,
	userId: string,
) {
	const result = await prisma.conversation.deleteMany({
		where: {
			id: conversationId,
			userId,
		},
	})

	return result.count > 0
}

export async function persistConversationTurn({
	assistantContent,
	conversationId,
	messages,
	userId,
}: {
	assistantContent: string
	conversationId?: string
	messages: ChatApiMessage[]
	userId: string
}) {
	const lastUserMessage = [...messages].reverse().find((message) => (
		message.role === 'user'
	))

	if (!lastUserMessage) {
		return null
	}

	const conversation = conversationId
		? await getUserConversation(conversationId, userId)
		: await prisma.conversation.create({
			data: {
				title: createConversationTitle(lastUserMessage.content),
				userId,
			},
		})

	if (!conversation) {
		return null
	}

	await prisma.$transaction([
		prisma.message.create({
			data: {
				content: lastUserMessage.content,
				conversationId: conversation.id,
				role: 'user',
			},
		}),
		prisma.message.create({
			data: {
				content: assistantContent,
				conversationId: conversation.id,
				role: 'assistant',
			},
		}),
		prisma.conversation.update({
			where: {
				id: conversation.id,
			},
			data: {
				updatedAt: new Date(),
			},
		}),
	])

	return conversation.id
}
