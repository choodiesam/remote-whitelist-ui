interface Props {
    text?: string
    onClick?: () => void
    bgColor?: string
    textColor?: string
}


export default function ButtonComponent({
    text = "",
    onClick = () => { },
    bgColor = "bg-stone-500",
    textColor = "text-white"
}: Props) {
    return (
        <button
            onClick={onClick}
            className={`${bgColor} ${textColor} p-2 rounded bg-opacity-70 hover:bg-opacity-100 w-full h-full`}
        >{text}</button>
    )
} 