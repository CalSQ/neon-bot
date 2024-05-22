import { ColorResolvable, Snowflake } from "discord.js"

export interface Config {
  info: {
    developerId?: Snowflake
    developerGuild?: Snowflake
    developerChannel?: Snowflake
    restVersion: string
  }

  verification: {
    verificationGuildId: Snowflake
    verifiedRoleId: Snowflake
  }

  colors: {
    default: ColorResolvable
    error: ColorResolvable
    info: ColorResolvable
    primary: ColorResolvable
  }
}
