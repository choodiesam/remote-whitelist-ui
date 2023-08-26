"use client"

import ButtonComponent from "@/components/buttonComponent"
import { signOut, useSession } from "next-auth/react"

export default function Profile() {
    const session = useSession()

    if (session.data?.user == null) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="text-sm">Profile</div>
            <div className="flex gap-4 items-center">
                <div className="font-bold">{session.data.user.name}</div>
                <div>
                    <ButtonComponent text="Sign out" onClick={() => signOut({ callbackUrl: "/" })} bgColor="bg-emerald-600" />
                </div>
            </div>
        </div>
    )
}