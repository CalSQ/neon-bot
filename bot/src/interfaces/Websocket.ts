export interface RobloxProfile {
  id: string
  username: string
  display_name: string
  profile_url: string
  picture_url: string
}

export interface UserSession {
  discordId: string
  roblox: RobloxProfile
}
