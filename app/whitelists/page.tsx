"use client"

import ButtonComponent from "@/components/buttonComponent"
import LoadingComponent from "@/components/loadingComponent"
import { Whitelist } from "@/services/interfaces"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { toast } from "react-toastify"

async function createWhitelist(name: string): Promise<Whitelist | null> {
    return await fetch("/api/whitelist", {
        method: "POST",
        body: JSON.stringify({ name }),
    })
        .then(res => {
            if (res.status === 201) {
                return res.json()
            }
            toast.error("Creating whitelist failed")
            return null
        })
}

async function fetchOwnedWhitelists(): Promise<Whitelist[]> {
    return fetch("/api/whitelist")
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            toast.error("Failed fetch owned whitelists")
            return []
        })
}

export default function Whitelist() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [whitelists, setWhitelists] = useState<Whitelist[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchOwnedWhitelists()
            .then(data => {
                setWhitelists(data)
                setIsLoading(false)
            })
    }, [])

    async function onSubmit() {
        if (name.length < 5) {
            return toast.warning("Length of whitelist name have be greater than 4 characters")
        }
        const whitelist = await createWhitelist(name)
        if (whitelist === null) {
            return toast.error("Creating whitelist failed")
        }
        toast.success("Whitelist created")
        setName("")
        setWhitelists([...whitelists, whitelist])
    }

    if (isLoading) {
        return <LoadingComponent />
    }

    return (
        <main className="flex flex-col gap-8">
            <div className="text-sm">Owned whitelists</div>
            <div className="grid grid-cols-[300px_min-content] gap-4 items-center">
                <div className="font-bold">Name</div>
                <div></div>
                <input onInput={e => setName(e.currentTarget.value)} value={name} className="p-2 bg-stone-200 rounded focus:bg-stone-300" placeholder="new whitelist" />
                <ButtonComponent text="Create" onClick={() => onSubmit()} bgColor="bg-emerald-600" />
                {whitelists.map(whitelist => {
                    return (
                        <Fragment key={whitelist._id.toString()}>
                            <div className="ml-2">{whitelist.name}</div>
                            <ButtonComponent text="Detail" onClick={() => router.push(`/whitelists/${whitelist._id.toString()}`)} />
                        </Fragment>
                    )
                })}
            </div>
        </main>
    )
}