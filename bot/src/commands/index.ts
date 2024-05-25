/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"
import sendVerifyMessage from "./slash/administration/sendVerifyMessage"
import verifyStatus from "./slash/administration/verifyStatus"

export const slashCategory = [
  category("administration", [sendVerifyMessage, verifyStatus]),
] as CommandCategory[]

export const contextCategory = [] as CommandCategory[]
