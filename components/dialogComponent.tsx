import { PropsWithChildren, useState } from "react"
import ButtonComponent from "./buttonComponent"

interface Props {
    title?: string
    description?: string
    onAccept: () => void
    onCancel: () => void
}

export default function DialogComponent(props: PropsWithChildren<Props>) {
    const [isDialogHidden, setIsDialogHidden] = useState(true)

    function handleAccept() {
        props.onAccept()
        setIsDialogHidden(true)
    }
    function handleCancel() {
        props.onCancel()
        setIsDialogHidden(true)
    }

    return (
        <div>
            <div className={`${isDialogHidden ? "hidden" : ""} bg-stone-900 bg-opacity-70 fixed bottom-0 right-0 top-0 left-0 grid items-center justify-center z-10`}>
                <div className="bg-stone-50 p-10 rounded-lg flex flex-col gap-4 items-center">
                    <div className="text-xl">{props.title}</div>
                    <div className="text-sm">{props.description}</div>
                    <div className="flex gap-8">
                        <ButtonComponent text="Accept" onClick={() => handleAccept()} bgColor="bg-emerald-600" />
                        <ButtonComponent text="Cancel" onClick={() => handleCancel()} />
                    </div>
                </div>
            </div>
            <div onClick={() => setIsDialogHidden(false)}>
                {props.children}
            </div>
        </div>
    )
}