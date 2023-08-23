"use client"

import ButtonComponent from "@/components/buttonComponent"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"

async function joiToWhitelist(inviteCode: string): Promise<boolean> {
    return fetch(`/api/whitelist/join/${inviteCode}`, { method: "POST" })
        .then(res => {
            if (res.status === 201) {
                return true
            }
            return false
        })
}

export default function JoinWhitelist() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const inviteCode = searchParams.get("inviteCode")

    async function handleAccept() {
        if (inviteCode === null) {
            return toast.warning("Invalid invite code")
        }
        const isJoined = await joiToWhitelist(inviteCode)

        if (isJoined) {
            toast.success("Successfully joined the whitelist")
        } else {
            toast.warning("You can not join the whitelist")
        }
    }

    return (
        <div className="flex flex-col gap-2 w-min">
            <div>
                <div className="font-bold">Join to whitelist with code</div>
                <div className="text-sm">{inviteCode}</div>
            </div>
            <ButtonComponent text="Accept" onClick={() => handleAccept()} bgColor="bg-emerald-600" />
        </div>
    )
}