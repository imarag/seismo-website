import { IoMdClose } from "react-icons/io";

export default function Message({ type, text, setError, setSuccess }) {
    const messagePosition = "fixed end-8 bottom-8 z-40"
    const messageText = "text-sm text-start font-semibold"
    const messageSize = "w-80 p-6"
    const messageBackground = `alert alert-${type} bg-${type}  opacity-80`
    const messageClassName = `transition-all ${messagePosition} ${messageText} ${messageSize} ${messageBackground}`
    return (
        <div className={messageClassName}>
            <button 
                className="btn btn-ghost btn-sm absolute end-1 top-1"
                onClick={() => {
                    setError(null)
                    setSuccess(null)
                }}
            >
                <IoMdClose />
            </button>
            { text }
        </div>
    )
}
