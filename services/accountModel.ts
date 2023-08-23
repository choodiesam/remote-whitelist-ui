import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { Account } from "./interfaces";

const collectionName = "accounts"

async function getCollection() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME).collection<Account>(collectionName)
}

export async function getUserAccounts(userId: ObjectId): Promise<Account[]> {
    const collection = await getCollection()
    const result = collection.find({ userId })
    const accounts = []

    for await (const account of result) {
        accounts.push(account)
    }

    return accounts
}
