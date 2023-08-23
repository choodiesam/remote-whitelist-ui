import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { UserNotFound, getUserFromSession } from "@/services/userModel";
import { Convert as allowedMemberWhitelistJson } from "@/transformer/allowedMemberWhitelistJson";
import {
    AddMemberToWhitelistFailed,
    RemoveMemberFromWhitelistFailed,
    SetAccessMemberWhitelistFailed,
    addMemberToWhitelist,
    removeMemberFromWhitelist,
    setAccessMemberWhitelist
} from "@/services/whitelistModel";

export async function POST(req: NextRequest, { params }: { params: { id: string, steamId: string } }) {
    try {
        const user = await getUserFromSession()
        const data = allowedMemberWhitelistJson.toAllowedMemberWhitelist(await req.text())
        const member = await addMemberToWhitelist(user._id, new ObjectId(params.id), { steamId: params.steamId, allowed: data.allowed })
        return new NextResponse(JSON.stringify(member), { status: 201 })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof AddMemberToWhitelistFailed) {
            return new NextResponse("", { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string, steamId: string } }) {
    try {
        const user = await getUserFromSession()
        await removeMemberFromWhitelist(user._id, new ObjectId(params.id), params.steamId)
        return new NextResponse("", { status: 200 })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof RemoveMemberFromWhitelistFailed) {
            return new NextResponse("", { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string, steamId: string } }) {
    try {
        const user = await getUserFromSession()
        const data = allowedMemberWhitelistJson.toAllowedMemberWhitelist(await req.text())
        await setAccessMemberWhitelist(user._id, new ObjectId(params.id), params.steamId, data.allowed)
        return new NextResponse("", { status: 200 })
    } catch (error) {
        if (error instanceof UserNotFound) {
            return new NextResponse("", { status: 401 })
        } else if (error instanceof SetAccessMemberWhitelistFailed) {
            return new NextResponse("", { status: 400 })
        }
    }
    return new NextResponse("", { status: 500 })
}
