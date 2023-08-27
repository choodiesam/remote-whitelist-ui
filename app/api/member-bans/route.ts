import { MemberBans } from "@/services/interfaces";
import { NextRequest, NextResponse } from "next/server";

async function fetchBans(steamId: string): Promise<MemberBans | null> {
    return fetch(`https://vaclist.net/api/account?q=${steamId}`)
        .then(res => {
            if (res.status != 200) {
                return null
            }
            return res.json()
        })
        .then(json => {
            if (json === null) {
                return null
            }
            return {
                vacBan: json.vac_bans > 0,
                gameBan: json.vac_bans > 0,
            }
        })
}

export async function GET(req: NextRequest) {
    const steamId = req.nextUrl.searchParams.get("steamId")
    const steamIdRegExp = new RegExp('[0-9]{17}')

    if (steamId === null || !steamIdRegExp.test(steamId)) {
        return new NextResponse("", { status: 400 })
    }
    const bans = await fetchBans(steamId)

    if (bans === null) {
        return new NextResponse("", { status: 404 })
    }

    return NextResponse.json(bans)
}