export default function Button({outline=false, loading=false, block=false, size="medium", children, ...props}) {
    const buttonSize = size === "small" ? "btn-sm" : size === "medium" ? "btn-md" : "btn-lg";
    return (
        <button 
            className={`btn btn-primary ${buttonSize} ${outline && "btn-outline"} ${block && "btn-block"}`}
            {...props}
        >
            {loading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    )
}
