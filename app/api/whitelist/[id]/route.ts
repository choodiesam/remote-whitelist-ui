import { UserNotFound, getUserFromSession } from "@/services/userModel";
import { DeleteOwnedWhitelistFailed, OwnedWhitelistNotFound, getOwnedWhitelist, removeOwnedWhitelist } from "@/services/whitelistModel";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromSession()
        const whitelist = await getOwnedWhitelist(user._id, new ObjectId(params.id))
        return NextResponse.json(whitelist)
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof OwnedWhitelistNotFound) {
            return new NextResponse("", { status: 404 })
        }
    }
    return new NextResponse("", { status: 500 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromSession()
        await removeOwnedWhitelist(user._id, new ObjectId(params.id))
        return new NextResponse("", { status: 200 })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof DeleteOwnedWhitelistFailed) {
            return new NextResponse("", { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}
