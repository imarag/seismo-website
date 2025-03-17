import { NavLink } from "@remix-run/react";

export default function LinkTag({ 
    href, 
    variant = "default", 
    size = "medium", 
    outline = false, 
    external = false, 
    children, 
    onClick,
    className = "", 
}) {
    const baseStyles = "z-40 inline-flex items-center gap-2 transition-all";

    const sizes = {
        small: "btn-sm",
        medium: "btn-md",
        large: "btn-lg",
    };

    const variants = {
        default: "text-info hover:underline", // Simple colored link
        button: `btn btn-primary rounded-md ${outline ? "btn-outline" : ""} ${sizes[size]}`, // Button-style link
    };

    const globalClass = `${baseStyles} ${variants[variant]} ${className}`;

    if (external) {
        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={globalClass} 
            >
                {children}
            </a>
        );
    }

    return (
        <NavLink 
            to={href} 
            onClick={onClick}
            className={({ isActive }) => 
                `${globalClass} ${isActive ? "font-bold underline" : ""}`
            } 
        >
            {children}
        </NavLink>
    );
}
