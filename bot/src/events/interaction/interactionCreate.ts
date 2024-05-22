import { ApplicationCommandType, ComponentType, InteractionType } from "discord.js";
import { event } from "../../interfaces"

export default event("interactionCreate", false, async ({ log, client }, interaction) => {
    try {
        switch (interaction.type) {
            case (InteractionType.ApplicationCommand): {
                switch (interaction.commandType) {
                    case (ApplicationCommandType.ChatInput): {
                        const command = client.commands.get(interaction.commandName);
                        if (!command) throw new Error(`Slash Command ${interaction.commandName} not registered.`);
                        await command.callback({client, interaction, log(...args) {
                            log(`[Slash Command: ${command.build.name}]`, ...args);
                        }})
                        break;
                    };
                    case (ApplicationCommandType.User):
                    case (ApplicationCommandType.Message): {
                        const command = client.contextMenus.get(interaction.commandName);
                        if (!command) throw new Error(`Context Menu Command ${interaction.commandName} not registered.`);
                        await command.callback({client, interaction, log(...args) {
                            log(`[Context Menu Command: ${command.build.name}]`, ...args);
                        }})
                        break;
                    };
                }
                break;
            };
            case (InteractionType.MessageComponent): {
                switch (interaction.componentType) {
                    case (ComponentType.Button): {
                        const button = client.buttons.get(interaction.customId);
                        if (!button) throw new Error(`Button ${interaction.customId} not registered.`);
                        await button.callback({client, interaction, log(...args) {
                            log(`[Button: ${button.name}]`, ...args);
                        }})
                        break;
                    };
                    case (ComponentType.RoleSelect):
                    case (ComponentType.MentionableSelect):
                    case (ComponentType.ChannelSelect):
                    case (ComponentType.StringSelect): {
                        const menu = client.selectMenus.get(interaction.customId);
                        if (!menu) throw new Error(`Select Menu ${interaction.customId} not registered.`);
                        await menu.callback({client, interaction, log(...args) {
                            log(`[Select Menu: ${menu.name}]`, ...args);
                        }})
                        break;
                    }
                }
                break;
            };
            case (InteractionType.ModalSubmit): {
                const modal = client.modals.get(interaction.customId);
                if (!modal) throw new Error(`Modal ${interaction.customId} not registered.`);
                await modal.callback({client, interaction, log(...args) {
                    log(`[Modal: ${modal.name}]`, ...args);
                }})
                break;
            };
        }
    } catch (err) {
        if (interaction.isRepliable()) {

        }
        console.error(err);
    }
})