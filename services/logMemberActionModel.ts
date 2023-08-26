import clientPromise from "./mongodb";
import { LogMemberAction, MemberActionType, Whitelist } from "./interfaces";
import { ObjectId } from "mongodb";

const collectionName = "logMemberActions"

async function getCollection() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME).collection<LogMemberAction>(collectionName)
}

export async function addMemberAction(whitelist: Whitelist, memberName: string, memberId: string, memberAddress: string, action: MemberActionType) {
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

export async function getMembersOnline(whitelist: Whitelist) {
    const collection = await getCollection()
    const docs = collection.aggregate<LogMemberAction>([
        { $match: { whitelistId: whitelist._id } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: '$memberId',
                whitelistId: { $first: '$whitelistId' },
                action: { $first: '$action' },
                createdAt: { $first: '$createdAt' },
                memberId: { $first: '$memberId' },
                memberName: { $first: '$memberName' },
                memberAddress: {
                    $first: '$memberAddress'
                }
            }
        },
        { $unset: '_id' }
    ])
    const logs: LogMemberAction[] = []

    for await (const doc of docs) {
        logs.push(doc)
    }

    return logs
}
