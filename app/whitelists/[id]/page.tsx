"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Member, Whitelist } from "@/services/interfaces"
import { useRouter } from "next/navigation"
import LoadingComponent from "@/components/loadingComponent"
import ButtonComponent from "@/components/buttonComponent"
import WhitelistMembersComponent from "@/components/whitelistMembersComponent"

async function fetchWhitelist(id: string): Promise<Whitelist | null> {
    return fetch(`/api/whitelist/${id}`)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            toast.error("Fetch whitelist failed")
            return null
        })
}

async function deleteWhitelist(whitelist: Whitelist): Promise<boolean> {
    return fetch(`/api/whitelist/${whitelist._id}`, { method: "DELETE" })
        .then(res => {
            if (res.status === 200) {
                return true
            }
            return false
        })
}

async function regenerateInviteCode(whitelist: Whitelist): Promise<{ inviteCode: string } | null> {
    return fetch(`/api/whitelist/${whitelist._id}/invite-code`, { method: "PUT" })
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            return null
        })
}

async function regenerateApiToken(whitelist: Whitelist): Promise<{ apiToken: string } | null> {
    return fetch(`/api/whitelist/${whitelist._id}/api-token`, { method: "PUT" })
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            return null
        })
}

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

export default function WhitelistDetail({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [whitelist, setWhitelist] = useState<Whitelist | null>(null)

    useEffect(() => {
        fetchWhitelist(params.id)
            .then(data => setWhitelist(data))
    }, [])

    function removeWhitelist(whitelist: Whitelist) {
        deleteWhitelist(whitelist)
            .then(isDeleted => {
                if (!isDeleted) {
                    return toast.error("Delete whitelist failed")
                }
                router.push("/whitelists")
            })
    }
    function newInviteCode(whitelist: Whitelist) {
        regenerateInviteCode(whitelist)
            .then(data => {
                if (data === null) {
                    return toast.error("Generate new invite code failed")
                }
                setWhitelist({ ...whitelist, inviteCode: data.inviteCode })
                toast.success("New invite code created")
            })
    }
    function newApiToken(whitelist: Whitelist) {
        regenerateApiToken(whitelist)
            .then(data => {
                if (data === null) {
                    return toast.error("Generate new api token failed")
                }
                setWhitelist({ ...whitelist, apiToken: data.apiToken })
                toast.success("New api token created")
            })
    }
    function copyInviteLink(inviteCode: string) {
        navigator.clipboard.writeText(`${location.protocol}//${location.host}/whitelists/join?inviteCode=${inviteCode}`)
        toast.success("Copied invite link to clipboard")
    }
    function copyApiUrl(apiToken: string) {
        navigator.clipboard.writeText(`${location.protocol}//${location.host}/api/whitelist/plugin/${apiToken}`)
        toast.success("Copied api url to clipboard")
    }
    async function handleRemoveMember(whitelist: Whitelist, member: Member) {
        const removed = await removeMember(whitelist, member)

        if (removed) {
            setWhitelist({ ...whitelist, members: whitelist.members.filter(m => m.steamId !== member.steamId) })
            toast.success(`Member with steam id ${member.steamId} was removed`)
        } else {
            toast.error("Failed to remove member from whitelist")
        }
    }
    async function handleToggleAccessMember(whitelist: Whitelist, member: Member) {
        const isAllowed = !member.allowed
        const updated = await updateAccessMember(whitelist, member, isAllowed)

        if (updated) {
            member.allowed = isAllowed
            setWhitelist({ ...whitelist })
            toast.success("The member's access has been adjusted")
        } else {
            toast.error("Changes member access failed")
        }
    }
    async function handleAddMember(whitelist: Whitelist, member: Member) {
        const added = await addMember(whitelist, member)

        if (added) {
            setWhitelist({ ...whitelist, members: [...whitelist.members, member] })
            toast.success("Member added")
        } else {
            toast.error("Member can not be add to whitelist")
        }
    }

    if (whitelist === null) {
        return <LoadingComponent />
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-sm">Detail whitelist</div>
            <div className="flex flex-col gap-1">
                <div className="font-bold">Name</div>
                <div>{whitelist.name}</div>
                <div className="font-bold">Api token</div>
                <div>{whitelist.apiToken}</div>
                <div className="font-bold">Invite code</div>
                <div>{whitelist.inviteCode}</div>
            </div>
            <div className="flex gap-6">
                <ButtonComponent text="Copy invite link" onClick={() => copyInviteLink(whitelist.inviteCode)} />
                <ButtonComponent text="Copy api url" onClick={() => copyApiUrl(whitelist.apiToken)} />
                <ButtonComponent text="New invite code" onClick={() => newInviteCode(whitelist)} bgColor="bg-emerald-600" />
                <ButtonComponent text="New api token" onClick={() => newApiToken(whitelist)} bgColor="bg-emerald-600" />
                <ButtonComponent text="Remove" onClick={() => removeWhitelist(whitelist)} bgColor="bg-rose-500" />
            </div>
            <WhitelistMembersComponent
                members={whitelist.members}
                onRemove={(member: Member) => handleRemoveMember(whitelist, member)}
                onToggleAccess={(member: Member) => handleToggleAccessMember(whitelist, member)}
                onAddMember={(member) => handleAddMember(whitelist, member)}
            />
        </div>
    )
}