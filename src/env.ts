import { config } from "dotenv"
import { z } from "zod"

// initialize dotenv
config()

const envConfig = z.object({
  BOT_TOKEN: z.string(),
  DATABASE_URL: z.string(),
})
export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL,
} as z.infer<(typeof envConfig)>

if (envConfig.safeParse(env).success === false) {
  throw new Error('Invalid environment variables')
}
