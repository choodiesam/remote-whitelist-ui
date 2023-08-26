import clientPromise from "./mongodb";
import { LogMemberAction, Whitelist } from "./interfaces";
import { ObjectId } from "mongodb";

const collectionName = "logMemberActions"

async function getCollection() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME).collection<LogMemberAction>(collectionName)
}

export async function addMemberAction(whitelist: Whitelist, memberName: string, memberId: string, memberAddress: string, action: string) {
    const collection = await getCollection()
    const logMemberAction: LogMemberAction = {
        _id: new ObjectId(),
        whitelistId: whitelist._id,
        action,
        createdAt: (new Date).toISOString(),
        memberId,
        memberName,
        memberAddress
    }
    const result = await collection.insertOne(logMemberAction)

    return logMemberAction
}

export async function getAllLogsByWhitelist(whitelist: Whitelist, limit: number = 50, skip: number = 0) {
    const collection = await getCollection()
    const docs = collection.find({ whitelistId: whitelist._id }, { limit, skip })
    const logs: LogMemberAction[] = []

    for await (const doc of docs) {
        logs.push(doc)
    }

    return logs
}
