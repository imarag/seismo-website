export function PrimaryButton({ loading=false, outline=false, size="medium", children, ...props }) {
    const buttonSize = size === "small" ? "btn-sm" : size === "medium" ? "btn-md" : "btn-lg";
    return (
        <button 
            className={`btn btn-primary ${outline && "btn-outline"} ${buttonSize}`}
            {...props}
        >
            {loading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    )
}

export function SecondaryButton({ loading=false, outline=false, size="medium", children, ...props }) {
    const buttonSize = size === "small" ? "btn-sm" : size === "medium" ? "btn-md" : "btn-lg";
    return (
        <button 
            className={`btn btn-secondary ${outline && "btn-outline"} ${buttonSize}`}
            {...props}
        >
            {loading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    )
}

export function GhostButton({ loading=false, size="medium", children, ...props }) {
    const buttonSize = size === "small" ? "btn-sm" : size === "medium" ? "btn-md" : "btn-lg";
    return (
        <button 
            className={`btn btn-ghost ${buttonSize}`}
            {...props}
        >
            {children}
        </button>
    )
}

