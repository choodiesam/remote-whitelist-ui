import { LogMemberAction, Member, Whitelist } from "@/services/interfaces"
import SwitchComponent from "./switchComponent"
import ButtonComponent from "./buttonComponent"
import { Fragment, useEffect, useState } from "react"
import { toast } from "react-toastify"
import MemberOnlineStatusComponent from "./memberOnlineStatusComponent"

async function addMember(whitelist: Whitelist, member: Member): Promise<boolean> {
    return fetch(`/api/whitelist/${whitelist._id}/member/${member.steamId}`, {
        method: "POST",
        body: JSON.stringify({ allowed: member.allowed })
    })
        .then(res => {
            if (res.status !== 201) {
                return false
            }
            return true
        })
}
async function removeMember(whitelist: Whitelist, member: Member) {
    return fetch(`/api/whitelist/${whitelist._id}/member/${member.steamId}`, { method: "DELETE" })
        .then(res => {
            if (res.status !== 200) {
                return false
            }
            return true
        })
}
async function updateAccessMember(whitelist: Whitelist, member: Member, isAllowed: boolean) {
    return fetch(`/api/whitelist/${whitelist._id}/member/${member.steamId}`, {
        method: "PUT",
        body: JSON.stringify({ allowed: isAllowed })
    })
        .then(res => {
            if (res.status !== 200) {
                return false
            }
            return true
        })
}
async function fetchMembersOnline(whitelist: Whitelist): Promise<LogMemberAction[]> {
    return fetch(`/api/whitelist/${whitelist._id}/member-action`)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            toast.error("Fetch members actions failed")
            return []
        })
}

interface Props {
    whitelist: Whitelist
    onChange: () => void
}

export default function WhitelistMembersComponent({ whitelist, onChange }: Props) {
    const [steamId, setSteamId] = useState("")
    const [isAllowed, setIsAllowed] = useState(false)
    const [membersOnline, setMembersOnline] = useState<LogMemberAction[]>([])
    const [membersOnlineLoading, setMembersOnlineLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchMembersOnline(whitelist)
            .then(data => {
                setMembersOnline(data)
                setMembersOnlineLoading(false)
            })
        const interval = setInterval(() => {
            setMembersOnlineLoading(true)
            fetchMembersOnline(whitelist)
                .then(data => {
                    setMembersOnline(data)
                    setMembersOnlineLoading(false)
                })
        }, 10000)

        return () => clearInterval(interval)
    }, [whitelist])

    async function handleRemoveMember(member: Member) {
        const removed = await removeMember(whitelist, member)

        if (removed) {
            whitelist.members = whitelist.members.filter(m => m.steamId !== member.steamId)
            onChange()
            toast.success(`Member with steam id ${member.steamId} was removed`)
        } else {
            toast.error("Failed to remove member from whitelist")
        }
    }
    async function handleToggleAccessMember(member: Member) {
        const isAllowed = !member.allowed
        const updated = await updateAccessMember(whitelist, member, isAllowed)

        if (updated) {
            member.allowed = isAllowed
            onChange()
            toast.success("The member's access has been adjusted")
        } else {
            toast.error("Changes member access failed")
        }
    }
    async function handleAddMember() {
        if (steamId.length < 5) {
            return toast.warning("Invalid steamId")
        }
        const newMember: Member = { steamId, allowed: isAllowed }
        const added = await addMember(whitelist, newMember)

        if (added) {
            whitelist.members = [...whitelist.members, newMember]
            onChange()
            toast.success("Member added")
            setSteamId("")
        } else {
            toast.error("Member can not be add to whitelist")
        }
    }

    return (
        <div>
            <div className="font-bold">Members</div>
            <div className="grid grid-cols-[50px_180px_min-content_min-content] items-center gap-4">
                <div>Online</div>
                <div>Steam ID</div>
                <div>Allowed</div>
                <div></div>
                <div></div>
                <input onInput={e => setSteamId(e.currentTarget.value)} value={steamId} className="p-2 bg-stone-200 rounded focus:bg-stone-300" placeholder="new member" />
                <SwitchComponent isChecked={isAllowed} onChange={() => setIsAllowed(!isAllowed)} onColor="bg-emerald-500" />
                <ButtonComponent text="Add" onClick={() => handleAddMember()} bgColor="bg-emerald-600" />
                {whitelist.members.map(member => {
                    return (
                        <Fragment key={member.steamId}>
                            <MemberOnlineStatusComponent
                                isLoading={membersOnlineLoading}
                                isOnline={membersOnline.find(mO => mO.memberId === member.steamId)?.action === "connected"}
                            />
                            <div className="ml-2">{member.steamId}</div>
                            <SwitchComponent isChecked={member.allowed} onChange={() => handleToggleAccessMember(member)} onColor="bg-emerald-500" />
                            <ButtonComponent text="Remove" onClick={() => handleRemoveMember(member)} bgColor="bg-rose-500" />
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}
