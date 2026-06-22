import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800'],
	style: 'normal',
	display: 'swap'
});

export const metadata: Metadata = {
  title: "Gemini Liquid Glass",
  description: "Um assistente de IA baseado no Gemini 1.5 Flash, projetado para fornecer respostas úteis, objetivas e amigáveis em português do Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${googleSansFlex.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
