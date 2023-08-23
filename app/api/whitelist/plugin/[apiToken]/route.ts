import { NextRequest, NextResponse } from "next/server"
import { WhitelistPluginNotFound, getPluginWhitelist } from "@/services/whitelistModel"


export async function GET(req: NextRequest, { params }: { params: { apiToken: string } }) {
    try {
        const whitelist = await getPluginWhitelist(params.apiToken)
        return NextResponse.json(whitelist)
    } catch (error) {
        if (error instanceof WhitelistPluginNotFound) {
            return new NextResponse("", { status: 401 })
        }
    }
    return new NextResponse("", { status: 500 })
}
