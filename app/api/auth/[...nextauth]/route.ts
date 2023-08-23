import { NextRequest } from "next/server"
import NextAuth from 'next-auth'
import SteamProvider from 'next-auth-steam'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/services/mongodb"

async function handler(
    req: NextRequest,
    ctx: {
        params: {
            nextauth: string[]
        }
    }
) {
    // @ts-ignore
    return NextAuth(req, ctx, {
        providers: [
            SteamProvider(req, {
                // @ts-ignore
                clientSecret: process.env.STEAM_API_KEY!,
                callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
            })
        ],
        session: {
            strategy: "jwt",
        },
        adapter: MongoDBAdapter(clientPromise, { databaseName: process.env.MONGODB_DB_NAME }),
    })
}

export {
    handler as GET,
    handler as POST
}