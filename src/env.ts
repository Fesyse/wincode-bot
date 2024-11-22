import { config } from "dotenv"

config()

import { z } from "zod"

const envConfig = z.object({
  BOT_TOKEN: z.string(),
})
export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN,
} as z.infer<(typeof envConfig)>

if (envConfig.safeParse(env).success === false) {
  throw new Error('Invalid environment variables')
}
