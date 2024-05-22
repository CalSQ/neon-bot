import { EmbedBuilder, Events } from "discord.js"
import { UserSession, event } from "../../interfaces"
import { io } from "socket.io-client"

export default event(Events.ClientReady, true, async ({ client }) => {
  console.log(`${client.user?.username} has logged in!`)

  // Send login message

  const devChannel = await client.channels.cache.get(
    client.config.info.developerChannel
  )
  if (devChannel?.isTextBased()) {
    const embed = new EmbedBuilder()
      .setTitle("Logged in")
      .setDescription(
        `${client.user?.username} logged in at ${new Date().toLocaleString()}!`
      )
      .setColor(client.config.colors.primary)
    devChannel.send({ embeds: [embed] })
  }

  // Websocket
  if (Bun.env.API_ENDPOINT) {
    const socket = io(Bun.env.API_ENDPOINT)

    socket.on("authenticate", async (user: UserSession) => {
      console.log(`[ Websocket ] Authentication | ${JSON.stringify(user)}`)
      const verificationGuild = await client.guilds.fetch(
        client.config.verification.verificationGuildId
      )
      const member = await verificationGuild.members.fetch(user.discordId)
      if (member.manageable) {
        // Update roles
        member.roles
          .add(client.config.verification.verifiedRoleId)
          .catch((err) => {
            return console.error(`Role Add Error | ${err}`)
          })

        // Send verified message
        const embed = new EmbedBuilder()
          .setTitle("✅  Verified")
          .setDescription(
            `Welcome, ${member.user.username}!\nYou have successfully verified your account in ${verificationGuild}`
          )
        await member.send({ embeds: [embed] }).catch(() => {
          console.warn(`Skipping, member ${member.id} has DMs disabled.`)
        })

        // Send dev message
        if (devChannel?.isTextBased()) {
          const embed = new EmbedBuilder()
            .setTitle("Verification")
            .setDescription(
              `${member} has verified their account.\n**Roblox ID:** ${user.robloxId}`
            )
            .setColor(client.config.colors.info)
          devChannel.send({ embeds: [embed] })
        }
      }
    })
  } else {
    console.error("[ Websocket ] No API_ENDPOINT provided!")
  }
})
