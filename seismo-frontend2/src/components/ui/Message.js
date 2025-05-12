import { IoMdClose } from "react-icons/io";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export default function Message({ type, text, setError, setSuccess }) {
    const messageBase = "flex flex-row items-center gap-4"
    const messagePosition = "fixed end-8 bottom-8 z-40"
    const messageText = "text-sm text-start font-semibold"
    const messageSize = "w-80 p-6"
    const messageBackground = `bg-base-100 shadow-2xl opacity-100`
    const messageBorder = "border border-neutral-500/20 rounded-lg"
    const messageClassName = `${messageBase} ${messageBorder} ${messagePosition} ${messageText} ${messageSize} ${messageBackground}`
    return (
        <div className={messageClassName}>
            <button 
                className="btn btn-ghost btn-sm absolute end-1 top-1"
                onClick={() => {
                    setError([])
                    setSuccess(null)
                }}
            >
                <IoMdClose />
            </button>
            <div className="flex-grow-0 flex-shrink-0">
                {
                    type === "error" ? (
                        <MdError className="size-8"/>
                    ) : (
                        <FaCheckCircle className="size-8"/>
                    )
                }
            </div>
            <div className="flex-grow">
                {
                    type === "error" ? (
                        text.map((errorElement, ind) => (
                            <p key={ind}>{ errorElement }</p>
                        ))
                    ) : (
                        <p>{ text }</p>
                    )
                }
            </div>
        </div>
    )
}
