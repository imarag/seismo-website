

export default function CoordButton({ label, className, onClick, children}) {
    return (
        <button 
        className={"flex flex-row gap-x-1 items-center rounded-md font-normal px-3 py-1 " + className}
        onClick={onClick}
        >
            { children }
            { label }
        </button>
    )
}