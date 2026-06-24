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

const datasourceUrl = process.env.DIRECT_URL
	?? process.env.DATABASE_URL
	?? 'postgresql://postgres:postgres@localhost:5432/postgres'

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
	},
	datasource: {
		url: datasourceUrl,
	},
})
