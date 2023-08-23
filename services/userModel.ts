import { getServerSession } from "next-auth";
import { getUserAccounts } from "./accountModel";
import { User } from "./interfaces";
import clientPromise from "./mongodb";

const collectionName = "users"

async function getCollection() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME).collection<User>(collectionName)
}


export async function getUserFromSession(): Promise<User> {
    const session = await getServerSession()

    if (session?.user?.email == null) {
        throw new UserNotFound
    }

    return await getUserByEmail(session.user.email)
}

export async function getUserByEmail(email: string): Promise<User> {
    const collection = await getCollection()
    const user = await collection.findOne({ email })

    if (user === null) {
        throw new UserNotFound
    }
    const accounts = await getUserAccounts(user._id)

    return { ...user, accounts }
}

export class UserNotFound extends Error { }
