"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Whitelist } from "@/services/interfaces"
import { useRouter } from "next/navigation"
import LoadingComponent from "@/components/loadingComponent"
import ButtonComponent from "@/components/buttonComponent"
import WhitelistMembersComponent from "@/components/whitelistMembersComponent"
import DialogComponent from "@/components/dialogComponent"

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


export default function WhitelistDetail({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [whitelist, setWhitelist] = useState<Whitelist | null>(null)

    useEffect(() => {
        fetchWhitelist(params.id)
            .then(data => setWhitelist(data))
    }, [params.id])

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
    function copyWhitelistEndpoint(apiToken: string) {
        navigator.clipboard.writeText(`${location.protocol}//${location.host}/api/whitelist/plugin/${apiToken}`)
        toast.success("Copied whitelist endpoint to clipboard")
    }
    function copyMemberEndpoint(apiToken: string) {
        navigator.clipboard.writeText(`${location.protocol}//${location.host}/api/whitelist/plugin/${apiToken}/member-action`)
        toast.success("Copied member endpoint to clipboard")
    }

    if (whitelist === null) {
        return <LoadingComponent />
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-sm">Detail whitelist</div>
            <div className="flex flex-col gap-4">
                <div>
                    <div className="font-bold">Name</div>
                    <div>{whitelist.name}</div>
                </div>
                <div>
                    <div className="font-bold">Api token</div>
                    <div>{whitelist.apiToken}</div>
                    <div className="grid grid-cols-[220px_220px] gap-4 text-sm">
                        <ButtonComponent text="Copy whitelist endpoint" onClick={() => copyWhitelistEndpoint(whitelist.apiToken)} />
                        <ButtonComponent text="Copy member action endpoint" onClick={() => copyMemberEndpoint(whitelist.apiToken)} />
                    </div>
                </div>
                <div>
                    <div className="font-bold">Invite code</div>
                    <div>{whitelist.inviteCode}</div>
                    <div className="grid grid-cols-[220px] gap-4 text-sm">
                        <ButtonComponent text="Copy invite link" onClick={() => copyInviteLink(whitelist.inviteCode)} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-3xl">
                <DialogComponent
                    title="Do you really want to generate a new invite code?"
                    description="The old code will be invalidated."
                    onAccept={() => newInviteCode(whitelist)}
                    onCancel={() => { }}
                >
                    <ButtonComponent text="New invite code" bgColor="bg-emerald-600" />
                </DialogComponent>
                <DialogComponent
                    title="Do you really want to generate a new API token?"
                    description="The old token can no longer be used."
                    onAccept={() => newApiToken(whitelist)}
                    onCancel={() => { }}
                >
                    <ButtonComponent text="New api token" bgColor="bg-emerald-600" />
                </DialogComponent>
                <DialogComponent
                    title="Do you really want to delete the whitelist?"
                    description="Once confirmed, this action cannot be reversed."
                    onAccept={() => removeWhitelist(whitelist)}
                    onCancel={() => { }}
                >
                    <ButtonComponent text="Remove" bgColor="bg-rose-500" />
                </DialogComponent>
            </div>
            <WhitelistMembersComponent whitelist={whitelist} onChange={() => setWhitelist({ ...whitelist })} />
        </div>
    )
}