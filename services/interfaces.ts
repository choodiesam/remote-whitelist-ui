import { ObjectId } from "mongodb"

export type AccountProvider = "steam" | "discord" | "twitch"
export type MemberActionType = "connected" | "disconnected"

export interface WhitelistPlugin {
    members: string[]
    createdAt: string
}

export interface Whitelist {
    _id: ObjectId
    name: string
    ownerId: ObjectId
    apiToken: string
    inviteCode: string
    members: Member[]
}

export interface Member {
    steamId: string
    allowed: boolean
}

export interface MemberBans {
    vacBan: boolean
    gameBan: boolean
}

export interface LogMemberAction {
    _id: ObjectId,
    whitelistId: ObjectId,
    memberName: string,
    memberId: string,
    memberAddress: string,
    action: MemberActionType,
    createdAt: string,
}

export interface Account {
    _id: ObjectId
    userId: ObjectId
    provider: AccountProvider
    providerAccountId: string
}

export interface User {
    _id: ObjectId
    name: string
    image?: string
    accounts: Account[]
}
