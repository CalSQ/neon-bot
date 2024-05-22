import {
  AnySelectMenuInteraction,
  ApplicationCommand,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  ContextMenuCommandInteraction,
  ModalSubmitInteraction,
  REST,
  Routes,
} from "discord.js"
import { Command, Event, Interaction } from "../interfaces"
import { config, deleteRequireCache } from "../utils"

export default class ApplicationClient extends Client {
  /**
   * Properties
   */
  public databaseConnected: boolean = false
  readonly events: Collection<string, Event>
  readonly commands: Collection<string, Command<ChatInputCommandInteraction>>
  readonly contextMenus: Collection<
    string,
    Command<ContextMenuCommandInteraction>
  >
  readonly buttons: Collection<string, Interaction<ButtonInteraction>>
  readonly selectMenus: Collection<
    string,
    Interaction<AnySelectMenuInteraction>
  >
  readonly modals: Collection<string, Interaction<ModalSubmitInteraction>>
  readonly config = config

  /**
   * Constructor
   * @param options Options provided for the client
   */
  constructor(options: ClientOptions) {
    super(options)

    this.events = new Collection()
    this.commands = new Collection()
    this.contextMenus = new Collection()
    this.buttons = new Collection()
    this.selectMenus = new Collection()
    this.modals = new Collection()

    this.registerCommands()
    this.registerInteractions()
    this.registerEvents()
  }

  /**
   * Event Registration
   * @description Registers all events for the discord bot
   */
  public async registerEvents() {
    deleteRequireCache("src/events/")
    await import("../events").then((eventsModule) => {
      const events = eventsModule.default
      for (const event of events) {
        this.events.set(event.key, event)
        if (event.once) {
          this.once(event.key, (...args) => {
            const log = console.log.bind(console, `[Event: ${event.key}]`)
            try {
              event.callback(
                ((client) => {
                  return { client, log }
                })(this),
                ...args
              )
            } catch (err) {
              log("[ ⚠ Uncaught Error ]", err)
            }
          })
        } else {
          this.on(event.key, (...args) => {
            const log = console.log.bind(console, `[Event: ${event.key}]`)
            try {
              event.callback(
                ((client) => {
                  return { client, log }
                })(this),
                ...args
              )
            } catch (err) {
              log("[ ⚠ Uncaught Error ]", err)
            }
          })
        }
      }
    })
  }

  /**
   * Command Registration
   * @description Registers all commands for the discord bot
   */
  public async registerCommands() {
    deleteRequireCache("src/commands/")
    await import("../commands").then(({ slashCategory, contextCategory }) => {
      const slashCommands = slashCategory
        .map((category) => category.commands)
        .flat()
      for (const command of slashCommands) {
        this.commands.set(command.build.name, command)
      }
      const contextCommands = contextCategory
        .map((category) => category.commands)
        .flat()
      for (const command of contextCommands) {
        this.contextMenus.set(command.build.name, command)
      }
    })
  }

  /**
   * Interaction Registration
   * @description Registers all interactions for the discord bot
   */
  public async registerInteractions() {
    deleteRequireCache("src/interactions/")
    await import("../interactions").then(
      ({ buttonCategory, menuCategory, modalCategory }) => {
        const buttons = buttonCategory
          .map((category) => category.interactions)
          .flat()
        for (const button of buttons) {
          this.buttons.set(button.name, button)
        }
        const menus = menuCategory
          .map((category) => category.interactions)
          .flat()
        for (const menu of menus) {
          this.selectMenus.set(menu.name, menu)
        }
        const modals = modalCategory
          .map((category) => category.interactions)
          .flat()
        for (const modal of modals) {
          this.modals.set(modal.name, modal)
        }
      }
    )
  }

  /**
   * Deploy Commands
   * @description Deploys application and guild commands
   * @param refresh Whether to refresh the command list for updates
   */
  public async deploy(refresh: boolean = false) {
    if (!Bun.env.DISCORD_BOT_TOKEN) throw new Error("Missing bot token")
    const BOT_ID = this.user?.id ?? Bun.env.DISCORD_APP_ID

    if (refresh) await this.registerCommands()
    const rest = new REST({ version: this.config.info.restVersion }).setToken(
      Bun.env.DISCORD_BOT_TOKEN!
    )
    const globalCommands = this.commands
      .filter((cmd) => cmd.developer !== true)
      .map(({ build }) => build)
      .flat()
      .concat(
        this.contextMenus
          .filter((cmd) => cmd.developer !== true)
          .map(({ build }) => build)
          .flat()
      )
    const devCommands = this.commands
      .filter((cmd) => cmd.developer === true)
      .map(({ build }) => build)
      .flat()
      .concat(
        this.contextMenus
          .filter((cmd) => cmd.developer === true)
          .map(({ build }) => build)
          .flat()
      )

    if (!BOT_ID)
      return console.warn(
        "[ DEPLOY ]: Application ID missing (Global Commands)"
      )

    // Global (Application) Commands
    const applicationCommandEndpoint = Routes.applicationCommands(BOT_ID)
    const applicationCommands = (await rest
      .put(applicationCommandEndpoint, { body: globalCommands })
      .catch((err) => {
        console.error("[ DEPLOY ERROR ]:", err)
      })) as ApplicationCommand[]
    console.log(
      `[ DEPLOY ]: Deployed ${applicationCommands.length} / ${globalCommands.length} global command(s)`
    )

    // Guild (Developer) Commands
    if (!this.config.info.developerGuild)
      return console.warn("[ DEPLOY ]: Guild ID missing (Developer Commands)")
    const applicationGuildCommandEndpoint = Routes.applicationGuildCommands(
      BOT_ID,
      this.config.info.developerGuild
    )
    const applicationGuildCommands = (await rest
      .put(applicationGuildCommandEndpoint, { body: devCommands })
      .catch((err) => {
        console.error("[ DEPLOY ERROR ]:", err)
      })) as ApplicationCommand[]
    console.log(
      `[ DEPLOY ]: Deployed ${applicationGuildCommands.length} / ${devCommands.length} developer command(s)`
    )
  }
}
