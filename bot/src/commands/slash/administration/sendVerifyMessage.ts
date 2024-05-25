import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"
import { command } from "../../../interfaces"

const build = new SlashCommandBuilder()
  .setName("send-verify-message")
  .setDescription("Sends the default verification message to a channel")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to send the message to")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export default command<ChatInputCommandInteraction>(
  build,
  async ({ interaction, client }) => {
    const channel =
      interaction.options.getChannel<ChannelType.GuildText>("channel")

    if (channel?.type === ChannelType.GuildText) {
      const embed = new EmbedBuilder()
        .setTitle("Verification")
        .setDescription(
          `Welcome to **${
            interaction.guild?.name ?? "the server"
          }**!\nTo proceed with your account, follow the process below.\n${"-".repeat(
            19
          )}`
        )
        .setFooter({
          text: "Contact administration for any issues.",
          iconURL:
            "https://cdn.discordapp.com/emojis/1240152810381643816.webp?size=80&quality=lossless",
        })
        .setFields([
          {
            name: "` 1 `  **Verify**",
            value: "Open the link by pressing the button below.",
          },
          {
            name: "` 2 `  **Discord**",
            value: "Authenticate with your Discord account.",
          },
          {
            name: "` 3 `  **Roblox**",
            value: "Authenticate with your Roblox account.",
          },
          {
            name: "` 4 `  **Age**",
            value: "You must have a 13+ account.",
          },
        ])
        .setColor(client.config.colors.primary)

      const button = new ButtonBuilder()
        .setLabel("Verify")
        .setStyle(ButtonStyle.Link)
        .setURL(
          Bun.env.API_ENDPOINT
            ? `${Bun.env.API_ENDPOINT}/discord/login`
            : "https://www.roblox.com"
        )

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

      channel
        .send({ embeds: [embed], components: [row] })
        .then(() => {
          return interaction.reply({
            content: "Verification message sent!",
            ephemeral: true,
          })
        })
        .catch(() => {
          return interaction.reply({
            content: "Failed to send verification message.",
            ephemeral: true,
          })
        })
    } else {
      return interaction.reply({
        content:
          "Invalid channel type, you must provide a valid text based channel.",
        ephemeral: true,
      })
    }
  }
)
