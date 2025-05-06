export default function CenterHorizontally({ className=null, children }) {
    return (
        <div className={`flex flex-row justify-center ${className || ""}`}>
            { children }
        </div>
    )
}