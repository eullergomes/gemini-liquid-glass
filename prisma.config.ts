import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

for (const envFile of ['.env', '.env.local']) {
	const envPath = resolve(process.cwd(), envFile)

	if (existsSync(envPath)) {
		config({
			path: envPath,
			override: false,
		})
	}
}

const migrationUrl = process.env.DIRECT_URL

if (!migrationUrl) {
	throw new Error('DIRECT_URL is required for Prisma migrations. Use the Supabase session-mode pooler URL in .env or .env.local.')
}

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
	},
	datasource: {
		url: migrationUrl,
	},
})
