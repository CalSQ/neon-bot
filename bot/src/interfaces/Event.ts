import ApplicationClient from "../classes/ApplicationClient"
import { ClientEvents, Awaitable } from 'discord.js';
import { Logger } from "./Logger";

export type EventKeys = keyof ClientEvents

export interface EventProps {
    client: ApplicationClient,
    log: Logger
}

export type EventCallback<T extends EventKeys> = (
    props: EventProps,
    ...args: ClientEvents[T]
) => Awaitable<unknown>


export interface Event<T extends EventKeys = EventKeys> {
    key: T,
    once: boolean,
    callback: EventCallback<T>
}

export function event<T extends EventKeys>(key: T, once: boolean, callback: EventCallback<T>): Event<T> {
    return { key, once, callback }
}