import { UserNotFound, getUserFromSession } from "@/services/userModel";
import { JoinWhitelistFailed, joinToWhitelist } from "@/services/whitelistModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { inviteCode: string } }) {
    try {
        const user = await getUserFromSession()
        const steamAccount = user.accounts.find(a => a.provider == "steam")

        if (steamAccount === undefined) {
            throw new JoinWhitelistFailed
        }
        const member = await joinToWhitelist(params.inviteCode, steamAccount.providerAccountId)
        return new NextResponse(JSON.stringify(member), { status: 201 })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof JoinWhitelistFailed) {
            return new NextResponse(error.message, { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}
