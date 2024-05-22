/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"
import sendVerifyMessage from "./slash/administration/sendVerifyMessage"

export const slashCategory = [
  category("administration", [sendVerifyMessage]),
] as CommandCategory[]

export const contextCategory = [] as CommandCategory[]
