import { NextRequest, NextResponse } from "next/server"
import { WhitelistNotFound, getByApiToken } from "@/services/whitelistModel"
import { Convert as LogMemberActionJson } from "@/transformer/logMemberActionJson"
import { addMemberAction } from "@/services/logMemberActionModel"


export async function POST(req: NextRequest, { params }: { params: { apiToken: string } }) {
    try {
        const whitelist = await getByApiToken(params.apiToken)
        const data = LogMemberActionJson.toLogMemberAction(await req.text())
        await addMemberAction(whitelist, data.playerName, data.playerId, data.playerAddress, data.action)

        return new NextResponse("", { status: 201 })
    } catch (error) {
        if (error instanceof WhitelistNotFound) {
            return new NextResponse("", { status: 401 })
        }
    }
    return new NextResponse("", { status: 500 })
}
