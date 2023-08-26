import { getAllLogsByWhitelist } from "@/services/logMemberActionModel";
import { UserNotFound, getUserFromSession } from "@/services/userModel";
import { OwnedWhitelistNotFound, getOwnedWhitelist } from "@/services/whitelistModel";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromSession()
        const whitelist = await getOwnedWhitelist(user._id, new ObjectId(params.id))
        const logs = await getAllLogsByWhitelist(whitelist)
        return NextResponse.json(logs)
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof OwnedWhitelistNotFound) {
            return new NextResponse("", { status: 404 })
        }
    }
    return new NextResponse("", { status: 500 })
}

