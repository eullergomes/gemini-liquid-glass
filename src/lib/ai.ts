import { google } from '@ai-sdk/google'
import type { ModelMessage } from 'ai'

export const GEMINI_MODEL = process.env.GOOGLE_GENERATIVE_AI_MODEL?.trim()
	|| 'gemini-3.1-flash-lite'

export const CHAT_SYSTEM_PROMPT = [
	'Você é um assistente útil, objetivo e amigável.',
	'Responda em português do Brasil por padrão, salvo se o usuário pedir outro idioma.',
	'Seja claro, prático e direto, mantendo um tom natural.',
].join(' ')

export function hasGoogleGenerativeAiApiKey() {
	return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim())
}

export function getGeminiModel() {
	return google(GEMINI_MODEL)
}

export function toModelMessages(
	messages: Array<{ content: string; role: 'assistant' | 'user' }>,
): ModelMessage[] {
	return messages.map((message) => ({
		role: message.role,
		content: message.content,
	}))
}
