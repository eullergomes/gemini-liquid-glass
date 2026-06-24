import type { Metadata } from 'next'
import { Google_Sans_Flex } from 'next/font/google'
import type { ReactNode } from 'react'
import { AuthSessionProvider } from '@/components/auth/auth-session-provider'
import './globals.css'

const googleSansFlex = Google_Sans_Flex({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800'],
	style: 'normal',
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Gemini Liquid Glass',
	description: 'Um assistente de IA baseado no Gemini 2.5 Flash, projetado para fornecer respostas úteis, objetivas e amigáveis em português do Brasil.',
	icons: {
		icon: '/assets/images/gemini-liquid-glass-logo.webp',
		shortcut: '/assets/images/gemini-liquid-glass-logo.webp',
		apple: '/assets/images/gemini-liquid-glass-logo.webp',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html
			lang="pt-BR"
			className={`${googleSansFlex.className} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				<AuthSessionProvider>{children}</AuthSessionProvider>
			</body>
		</html>
	)
}
