export default function Button({
    variant = "primary",
    size = "medium",
    type = "button",
    block = false,
    outline = false,
    onClick,
    disabled = false,
    loading = false,
    children,
    toolTipText = null,
    className = ""
}) {
    const baseStyles = "btn z-30 rounded-md inline-flex items-center gap-2 disabled:bg-transparent";

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
        <div className="tooltip z-30" data-tip={toolTipText}>
            <button
                className={`${baseStyles} ${variants[variant]} ${outline ? "btn-outline" : ""} ${block && "btn-block"} ${sizes[size]} ${className}`}
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
