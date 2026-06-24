import { AppShell } from '@/components/layout/app-shell'

export default async function ConversationPage({
	params,
}: {
	params: Promise<{ conversationId: string }>
}) {
	const { conversationId } = await params

	return <AppShell initialConversationId={conversationId} />
}
