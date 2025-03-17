export default function Button({ 
    variant = "primary", 
    size = "medium",
    type = "button", 
    outline = false, 
    onClick, 
    disabled = false, 
    loading = false, 
    children, 
    toolTipText = null,
    className = "" 
}) {
    const baseStyles = "btn inline-flex items-center gap-2 disabled:bg-transparent disabled:text-gray-350"; 

    const sizes = {
        small: "btn-sm",
        medium: "btn-md",
        large: "btn-lg",
        "extra-small": "btn-xs"
    };

    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        error: "btn-error",
        info: "btn-info",
        success: "btn-success",
        ghost: "btn-ghost"
    };

    return (
        <div className="tooltip z-40" data-tip={toolTipText}>
            <button 
                className={`${baseStyles} ${variants[variant]} ${outline ? "btn-outline" : ""} ${sizes[size]} ${className}`} 
                type={type}
                onClick={onClick} 
                disabled={disabled || loading}
            >
                {loading && <span className="loading loading-spinner"></span>}
                {children}
            </button>
        </div>
    );
}
