import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { Member, Whitelist, WhitelistPlugin } from "./interfaces";
import { randomBytes } from "crypto";

const collectionName = "whitelists"

async function getCollection() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME).collection<Whitelist>(collectionName)
}

function generateApiToken() {
    return randomBytes(32).toString("hex")
}

function generateInviteCode() {
    return randomBytes(16).toString("hex")
}

export async function createWhielist(userId: ObjectId, name: string): Promise<Whitelist> {
    const collection = await getCollection()
    const whitelist = {
        _id: new ObjectId(),
        name,
        ownerId: userId,
        apiToken: generateApiToken(),
        inviteCode: generateInviteCode(),
        members: []
    }
    await collection.insertOne(whitelist)

    return whitelist
}

export async function getOwnedWhitelists(ownerId: ObjectId): Promise<Whitelist[]> {
    const collection = await getCollection()
    const result = collection.find({ ownerId })
    const whitelists = []

    for await (const whitelist of result) {
        whitelists.push(whitelist)
    }

    return whitelists
}

export async function getOwnedWhitelist(ownerId: ObjectId, whitelistId: ObjectId): Promise<Whitelist> {
    const collection = await getCollection()
    const whitelist = await collection.findOne({ _id: whitelistId, ownerId }) as Whitelist

    if (whitelist === null) {
        throw new OwnedWhitelistNotFound
    }

    return whitelist
}

export async function removeOwnedWhitelist(ownerId: ObjectId, whitelistId: ObjectId) {
    const collection = await getCollection()
    const result = await collection.deleteOne({ _id: whitelistId, ownerId })

    if (result.deletedCount !== 1) {
        throw new DeleteOwnedWhitelistFailed
    }
}

export async function regenerateInviteCode(ownerId: ObjectId, whitelistId: ObjectId): Promise<string> {
    const collection = await getCollection()
    const inviteCode = generateInviteCode()
    const result = await collection.updateOne({ _id: whitelistId, ownerId }, { $set: { inviteCode } })

    if (result.modifiedCount !== 1) {
        throw new NewInviteCodeFailed
    }
    return inviteCode
}

export async function regenerateApiToken(ownerId: ObjectId, whitelistId: ObjectId): Promise<string> {
    const collection = await getCollection()
    const apiToken = generateApiToken()
    const result = await collection.updateOne({ _id: whitelistId, ownerId }, { $set: { apiToken } })

    if (result.modifiedCount !== 1) {
        throw new NewApiTokenFailed
    }
    return apiToken
}

export async function joinToWhitelist(inviteCode: string, steamId: string): Promise<Member> {
    const collection = await getCollection()
    const member: Member = {
        steamId,
        allowed: false,
    }
    const result = await collection.updateOne({
        inviteCode,
        "members.steamId": { $ne: steamId }
    }, { $push: { members: member } })

    if (result.modifiedCount !== 1) {
        throw new JoinWhitelistFailed
    }
    return member
}

export async function addMemberToWhitelist(ownerId: ObjectId, whitelistId: ObjectId, member: Member): Promise<Member> {
    const collection = await getCollection()
    const result = await collection.updateOne({
        _id: whitelistId,
        ownerId,
        "members.steamId": { $ne: member.steamId }
    }, { $push: { members: member } })

    if (result.modifiedCount !== 1) {
        throw new AddMemberToWhitelistFailed
    }
    return member
}

export async function removeMemberFromWhitelist(ownerId: ObjectId, whitelistId: ObjectId, steamId: string) {
    const collection = await getCollection()
    const result = await collection.updateOne({
        _id: whitelistId,
        ownerId,
    }, { $pull: { members: { steamId } } })

    if (result.modifiedCount !== 1) {
        throw new RemoveMemberFromWhitelistFailed
    }
}

export async function setAccessMemberWhitelist(ownerId: ObjectId, whitelistId: ObjectId, steamId: string, isAllowed: boolean) {
    const collection = await getCollection()
    const result = await collection.updateMany(
        { _id: whitelistId, ownerId },
        { $set: { "members.$[m].allowed": isAllowed } },
        { arrayFilters: [{ "m.steamId": steamId }] }
    )

    if (result.modifiedCount !== 1) {
        throw new SetAccessMemberWhitelistFailed
    }
}
export async function getPluginWhitelist(apiToken: string): Promise<WhitelistPlugin> {
    const collection = await getCollection()
    const docs = collection.aggregate([
        { $match: { apiToken } },
        {
            $project: {
                _id: 0,
                members: {
                    $filter: {
                        input: '$members',
                        as: 'member',
                        cond: {
                            $eq: ['$$member.allowed', true]
                        }
                    }
                }
            }
        },
        {
            $set: {
                members: '$members.steamId',
                createdAt: new Date()
            }
        }
    ])
    let whitelist: WhitelistPlugin | null = null

    for await (const doc of docs) {
        whitelist = doc as WhitelistPlugin
    }

    if (whitelist === null) {
        throw new WhitelistPluginNotFound
    }

    return whitelist
}

export class WhitelistPluginNotFound extends Error { }
export class SetAccessMemberWhitelistFailed extends Error { }
export class RemoveMemberFromWhitelistFailed extends Error { }
export class JoinWhitelistFailed extends Error { }
export class AddMemberToWhitelistFailed extends Error { }
export class DeleteOwnedWhitelistFailed extends Error { }
export class NewInviteCodeFailed extends Error { }
export class NewApiTokenFailed extends Error { }
export class OwnedWhitelistNotFound extends Error { }
