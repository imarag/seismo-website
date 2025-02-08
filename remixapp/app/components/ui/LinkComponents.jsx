
import { NavLink } from "@remix-run/react";


export function LinkTag({ href = "#", children }) {
    return (
        <NavLink 
            to={href} 
            className="link link-info inline-flex items-center gap-2"
        >
            {children}
        </NavLink>
    )
}

export function ButtonLinkTag({ href = "#", size="medium", outline=false, children }) {
    const buttonSize = size === "small" ? "btn-sm" : size === "medium" ? "btn-md" : "btn-lg";
    return (
        <NavLink 
            to={href} 
            className={`btn btn-primary ${outline && "btn-outline"} ${buttonSize} inline-flex items-center gap-2`}
        >
            {children}
        </NavLink>
    )
}

export function ExternalLinkTag({ href = "#", children }) {
    return (
        <a 
            className="link link-info inline-flex items-center gap-2" 
            href={href} 
            target="_blank"
        >
            {children}
        </a>
    )
}
