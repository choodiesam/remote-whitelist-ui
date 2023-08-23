import { Member } from "@/services/interfaces"
import SwitchComponent from "./switchComponent"
import ButtonComponent from "./buttonComponent"
import { Fragment, useState } from "react"
import { toast } from "react-toastify"

export default function WhitelistMembersComponent({
    members,
    onToggleAccess,
    onRemove,
    onAddMember,
}: { members: Member[], onToggleAccess: (member: Member) => void, onRemove: (member: Member) => void, onAddMember: (member: Member) => void }) {
    const [steamId, setSteamId] = useState("")
    const [isAllowed, setIsAllowed] = useState(false)

    function handleAddMember() {
        if (steamId.length < 5) {
            return toast.warning("The length of the Steam ID must not be less than 5 characters")
        }
        onAddMember({ steamId, allowed: isAllowed })
        setSteamId("")
        setIsAllowed(false)
    }

    return (
        <div>
            <div className="font-bold">Members</div>
            <div className="grid grid-cols-[180px_min-content_min-content] items-center gap-4">
                <div>Steam ID</div>
                <div>Allowed</div>
                <div></div>
                <input onInput={e => setSteamId(e.currentTarget.value)} value={steamId} className="p-2 bg-stone-200 rounded focus:bg-stone-300" placeholder="new member" />
                <SwitchComponent isChecked={isAllowed} onChange={() => setIsAllowed(!isAllowed)} onColor="bg-emerald-500" />
                <ButtonComponent text="Add" onClick={() => handleAddMember()} bgColor="bg-emerald-600" />
                {members.map(member => {
                    return (
                        <Fragment key={member.steamId}>
                            <div className="text-base ml-2">{member.steamId}</div>
                            <SwitchComponent isChecked={member.allowed} onChange={() => onToggleAccess(member)} onColor="bg-emerald-500" />
                            <ButtonComponent text="Remove" onClick={() => onRemove(member)} bgColor="bg-rose-500" />
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}
