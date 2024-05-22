import ApplicationClient from "../classes/ApplicationClient"
import { Awaitable, Interaction as DiscordInteraction } from 'discord.js';
import { Logger } from "./Logger";

export interface interactionProps<T> {
    interaction: T
    client: ApplicationClient,
    log: Logger
}

export type interactionCallback<T> = (
    props: interactionProps<T>
) => Awaitable<unknown>

export interface Interaction<T extends DiscordInteraction> {
    name: string;
    callback: interactionCallback<T>
}

export interface InteractionCategory {
    name: string,
    interactions: Interaction<DiscordInteraction>[]
}

export function interaction<T extends DiscordInteraction>(name: string, callback: interactionCallback<T>): Interaction<T> {
    return {
        name,
        callback
    }
}

export function interactionCategory(name: string, interactions: Interaction<any>[]): InteractionCategory {
    return {
        name,
        interactions
    }
}