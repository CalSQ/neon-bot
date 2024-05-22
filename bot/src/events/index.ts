/*

    Event files for discord and other packages

*/

import { Event } from "../interfaces"

import clientReady from "./client/clientReady"
import interactionCreate from "./interaction/interactionCreate"

export default [clientReady, interactionCreate] as Event[]
