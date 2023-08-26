interface Props {
    isChecked: boolean
    onChange: () => void
    onColor?: string
    offColor?: string
}


export default function SwitchComponent({
    isChecked,
    onChange,
    onColor = "bg-stone-400",
    offColor = "bg-gray-300"
}: Props) {
    function handleClick() {
        onChange()
    }

    return (
        <div onClick={() => handleClick()} className={`flex items-center p-1 transition cursor-pointer w-12 h-7 rounded-full justify-self-center ${isChecked ? onColor : offColor}`}>
            <div className={`w-5 h-5 rounded-full bg-gray-50 transition ${isChecked ? "translate-x-5" : "translate-x-0"}`}></div>
        </div>
    )
}