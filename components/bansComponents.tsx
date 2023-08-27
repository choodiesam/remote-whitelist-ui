import { Member } from "@/services/interfaces"
import { useEffect, useState } from "react"

async function fetchBans(member: Member): Promise<MemberBans | null> {
    return fetch(`/api/member-bans?steamId=${member.steamId}`)
        .then(res => {
            if (res.status != 200) {
                return null
            }
            return res.json()
        })
}

interface MemberBans {
    vacBan: boolean
    gameBan: boolean
}

interface Props {
    member: Member
}

export default function BansComponent({ member }: Props) {
    const [bans, setBans] = useState<MemberBans | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchBans(member)
            .then(data => {
                setBans(data)
                setIsLoading(false)
            })
    }, [member])
    let icon

    if (isLoading) {
        icon = <LoadingIcon />
    } else if (bans === null) {
        icon = <div>unknow</div>
    } else if (!bans.vacBan && !bans.gameBan) {
        icon = <div>none</div>
    } else {
        icon = <BanIcon />
    }

    return (
        <div title={bans?.vacBan ? "VAC ban" : bans?.gameBan ? "Game ban" : ""} className="flex justify-center items-center">
            {icon}
        </div>
    )
}


function BanIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-500 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
        </svg>
    )
}

function LoadingIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin text-stone-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    )
}
