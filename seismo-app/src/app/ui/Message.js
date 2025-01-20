export default function Message({ type, text }) {
    return (
        <div className={`fixed opacity-80 start-0 end-0 top-0 alert alert-${type} bg-${type} text-center flex flex-row justify-center`}>
            { text }
        </div>
    )
}
