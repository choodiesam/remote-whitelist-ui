import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { UserNotFound, getUserFromSession } from "@/services/userModel"
import { NewInviteCodeFailed, regenerateInviteCode } from "@/services/whitelistModel"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromSession()
        const inviteCode = await regenerateInviteCode(user._id, new ObjectId(params.id))
        return NextResponse.json({ inviteCode })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof NewInviteCodeFailed) {
            return new NextResponse("", { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}
