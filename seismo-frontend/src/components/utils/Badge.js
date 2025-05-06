export default function Badge({ type="neutral", outline=false, size="medium", children, ...props }) {

    const sizes = {
        small: "badge-sm",
        medium: "badge-md",
        large: "badge-lg",
        "extra-small": "badge-xs"
    };

    return (
        <div 
            className={`badge badge-${type} ${outline && "badge-outline"} ${sizes[size]} hover:scale-115`}
            {...props}
        >
            { children }
        </div>
    )
}