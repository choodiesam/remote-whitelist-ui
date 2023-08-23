import { NextRequest, NextResponse } from "next/server"
import { UserNotFound, getUserFromSession } from "@/services/userModel"
import { createWhielist, getOwnedWhitelists } from "@/services/whitelistModel"
import { Convert as CreateWhitelistTransformer } from "@/transformer/createWhitelistJson"
import { InvalidParams } from "@/transformer/error"

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromSession()
        const createWhitelistData = CreateWhitelistTransformer.toCreateWhitelist(await req.text())
        const whitelist = await createWhielist(user._id, createWhitelistData.name)
        return new NextResponse(JSON.stringify(whitelist), { status: 201 })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof InvalidParams) {
            return new NextResponse(error.message, { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromSession()
        const whitelists = await getOwnedWhitelists(user._id)
        return NextResponse.json(whitelists)
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        }
    }
    return new NextResponse("", { status: 500 })
}
