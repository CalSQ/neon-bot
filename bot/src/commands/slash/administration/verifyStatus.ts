import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  time,
} from "discord.js"
import { RobloxProfile, RobloxStatus, command } from "../../../interfaces"
import axios from "axios"

const build = new SlashCommandBuilder()
  .setName("verify-status")
  .setDescription("Get verification status of a user.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to check verification status for.")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export default command<ChatInputCommandInteraction>(
  build,
  async ({ interaction, client }) => {
    const user = interaction.options.getUser("user", true)

    console.log(`${process.env.API_ENDPOINT}/roblox/status/${user.id}`)

    try {
      const data = await axios.get<RobloxStatus>(
        `${process.env.API_ENDPOINT}/roblox/status/${user.id}`
      )

      const embed = new EmbedBuilder()
        .setAuthor({
          name: data.data.username,
          url: data.data.profile_url,
          iconURL: data.data.picture_url,
        })
        .setDescription(
          `**ID**: ${data.data.id}\nUser last verified ${time(
            new Date(data.data.verifiedAt),
            "R"
          )} (UTC Time)`
        )
        .setColor(client.config.colors.primary)

      interaction.reply({ embeds: [embed] })
    } catch (err) {
      interaction.reply({
        content:
          "There was an error fetching the user's verification status or non exists.",
        ephemeral: true,
      })
      console.error(`[ Verify Status ] Problem fetching | ${err}`)
    }
  }
)
