import ApplicationClient from "../classes/ApplicationClient"
import {
  Awaitable,
  CommandInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"
import { Logger } from "./Logger"

export type CommandBuild =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  | ContextMenuCommandBuilder

export interface CommandProps<T> {
  interaction: T
  client: ApplicationClient
  log: Logger
}

export type CommandCallback<T> = (props: CommandProps<T>) => Awaitable<unknown>

export interface Command<T extends CommandInteraction> {
  build: CommandBuild
  callback: CommandCallback<T>
  developer: boolean
}

export interface CommandCategory {
  name: string
  commands: Command<CommandInteraction>[]
}

export function command<T extends CommandInteraction>(
  build: CommandBuild,
  callback: CommandCallback<T>,
  developer: boolean = false
): Command<T> {
  return {
    build,
    callback,
    developer,
  }
}

export function category(
  name: string,
  commands: Command<any>[]
): CommandCategory {
  return {
    name,
    commands,
  }
}
