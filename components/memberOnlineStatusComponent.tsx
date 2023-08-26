import { LogMemberAction } from "@/services/interfaces"
import { useState } from "react"

interface Props {
    isLoading: boolean
    logMemberAction?: LogMemberAction
}

function LoadingIconComponent() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin text-stone-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    )
}
function QuestionMarkIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>

    )
}
function OnlineIconComponent() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    )
}
function OfflineIconComponent() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z" />
        </svg>
    )
}

export default function MemberOnlineStatusComponent({ isLoading, logMemberAction }: Props) {
    const [isHoverIcon, setIsHoverIcon] = useState(false)
    let icon = <QuestionMarkIcon />

    if (isLoading) {
        icon = <LoadingIconComponent />
    } else if (logMemberAction?.action === "connected") {
        icon = <OnlineIconComponent />
    } else if (logMemberAction?.action === "disconnected") {
        icon = <OfflineIconComponent />
    }

    return (
        <div onMouseOver={() => setIsHoverIcon(true)} onMouseOut={() => setIsHoverIcon(false)} className="flex justify-center cursor-pointer">
            {icon}
            <div className={`${logMemberAction !== undefined && isHoverIcon ? "visible" : "invisible"} absolute -translate-y-full translate-x-1/2 shadow p-4 rounded-lg text-sm bg-stone-300 grid grid-cols-[min-content_min-content] gap-2 whitespace-nowrap`}>
                <div>Name:</div>
                <div>{logMemberAction?.memberName}</div>
                <div>Time:</div>
                <div>{logMemberAction?.createdAt}</div>
            </div>
        </div>
    )
}