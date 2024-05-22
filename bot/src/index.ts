import { DiscordjsError, GatewayIntentBits, Partials } from "discord.js"
import ApplicationClient from "./classes/ApplicationClient"

const client = new ApplicationClient({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.User, Partials.GuildMember],
})

if (Bun.argv.includes("--deploy")) {
  await client.deploy(true)
  process.exit(0)
}

client.login(Bun.env.DISCORD_BOT_TOKEN).catch((err: unknown) => {
  if (err instanceof DiscordjsError) {
    return console.error(`[ Bot: ${err.code} ] ${err.name} - ${err.message}`)
  }
  throw err
})
